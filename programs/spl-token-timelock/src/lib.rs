use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::{self, AssociatedToken, Create},
    token::{self, Mint, TokenAccount, Transfer, Token}
};

use spl_token::amount_to_ui_amount;

declare_id!("7ZKgDhm71m64SH96ipnEVdfTNaQMwxPij4hcCYDKXW4S");

#[program]
pub mod spl_token_timelock {
    use super::*;

    pub fn create_vesting(
        ctx: Context<CreateVesting>,
        nonce: u8,
        start_ts: u64,
        end_ts: u64,
        total_amount: u64,
        period: u64,
        cliff: u64,
        tge_rate: u64,
    ) -> ProgramResult {
        msg!("Initializing SPL token stream");

        let now = ctx.accounts.clock.unix_timestamp as u64;
        if !duration_sanity(now, start_ts, end_ts, cliff) {
            return Err(ErrorCode::InvalidSchedule.into());
        }
        if period == 0 || period >= (end_ts - start_ts) {
            return Err(ErrorCode::InvalidPeriod.into());
        }
        if tge_rate > 100 {
            return Err(ErrorCode::InvalidTGERate.into());
        }

        let recipient_tokens_key = associated_token::get_associated_token_address(
            ctx.accounts.recipient.key,
            ctx.accounts.mint.to_account_info().key,
        );
        if &recipient_tokens_key != ctx.accounts.beneficiary.key {
            return Err(ErrorCode::InvalidAssociatedTokenAddress.into());
        }

        if ctx.accounts.beneficiary.data_is_empty() {
            let cpi_accounts = Create {
                payer: ctx.accounts.granter.to_account_info(),
                associated_token: ctx.accounts.beneficiary.clone(),
                authority: ctx.accounts.recipient.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            };
            let cpi_program = ctx.accounts.associated_token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            associated_token::create(cpi_ctx)?;
        }

        let vesting = &mut ctx.accounts.vesting;
        vesting.magic = 0x544D4C4B;
        vesting.version = 1;
        vesting.nonce = nonce;
        // vesting.vesting_id = vesting_id;
        // vesting.vesting_name = vesting_name.clone();
        // vesting.investor_wallet_address = investor_wallet_address.clone();

        vesting.withdrawn_amount = 0;
        vesting.remaining_amount = total_amount;
        vesting.total_amount = total_amount;

        vesting.granter = *ctx.accounts.granter.to_account_info().key;
        vesting.sender = *ctx.accounts.sender.to_account_info().key;
        vesting.recipient = *ctx.accounts.recipient.to_account_info().key;
        vesting.beneficiary = *ctx.accounts.beneficiary.key;
        vesting.mint = *ctx.accounts.mint.to_account_info().key;
        vesting.vault = *ctx.accounts.vault.to_account_info().key;

        vesting.created_ts = now;
        vesting.start_ts = start_ts;
        vesting.end_ts = end_ts;
        vesting.accounting_ts = now;
        vesting.last_withdrawn_at = 0;

        vesting.period = period;
        vesting.cliff = cliff;

        vesting.tge_rate = tge_rate;
        vesting.tge_amount = 0;

        if tge_rate != 0 {
            vesting.tge_amount = amount_to_ui_amount(total_amount.saturating_mul(tge_rate), 2) as u64;
        }

        vesting.unlock_amount = ((total_amount - vesting.tge_amount) / (end_ts - start_ts)) * period;
        if cliff != 0 {
            vesting.unlock_amount = ((total_amount - vesting.tge_amount) / (end_ts - cliff)) * period;
        }
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.granter.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, total_amount)?;

        Ok(())
    }


    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {

        if amount == 0 {
            return Err(ErrorCode::InvalidWithdrawalAmount.into());
        }

        let now = ctx.accounts.clock.unix_timestamp as u64;
        let available = available_for_withdrawal(
            &ctx.accounts.vesting,
            now,
        );

        if amount > available{
            return Err(ErrorCode::InsufficientWithdrawalBalance.into());
        }
        
        // Transfer funds out.
        let vesting = &mut ctx.accounts.vesting;
        let seeds = &[
            vesting.to_account_info().key.as_ref(),
            &[vesting.nonce],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.beneficiary.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts).with_signer(signer);
        token::transfer(cpi_ctx, amount)?;

        vesting.remaining_amount = vesting.remaining_amount.checked_sub(amount).unwrap();

        vesting.withdrawn_amount = vesting.withdrawn_amount.checked_add(amount).unwrap();

        vesting.accounting_ts = now - (now - vesting.accounting_ts)
                                .checked_rem(vesting.period).unwrap();
        
        vesting.last_withdrawn_at = now;

        Ok(())

    }

    pub fn cancel(ctx: Context<CancelVesting>) -> ProgramResult {

        //Check the balance in the vault
        let remaining = ctx.accounts.vault.amount;
        if remaining > 0 {
            // Transfer funds out.
            let seeds = &[
                ctx.accounts.vesting.to_account_info().key.as_ref(),
                &[ctx.accounts.vesting.nonce],
            ];
            let signer = &[&seeds[..]];
            let cpi_accounts = Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.sender.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts).with_signer(signer);
            token::transfer(cpi_ctx, remaining)?;
        }


        Ok(())
    }

}


#[derive(Accounts)]
#[instruction(total_amount: u64, nonce: u8)]
pub struct CreateVesting<'info> {
    
    pub granter: Signer<'info>,

    #[account(
        mut,
        constraint = sender.amount >= total_amount @ErrorCode::InsufficientDepositAmount,
        constraint = sender.mint == mint.key() @ErrorCode::InvalidMintMismatch,
        constraint = total_amount > 0 @ErrorCode::InvalidDepositAmount,
        associated_token::mint = mint,
        associated_token::authority = granter,
    )]
    pub sender: Account<'info, TokenAccount>,
    ///the recipient of main account
    pub recipient: AccountInfo<'info>,
    ///the recipient of token account
    pub beneficiary: AccountInfo<'info>,

    #[account(
        init,
        payer = granter,
        owner = id(),
        rent_exempt = enforce,
    )]
    pub vesting: Box<Account<'info, Vesting>>,

    #[account(
        init, payer = granter, 
        seeds = [vesting.to_account_info().key.as_ref()], bump = nonce,
        owner = token_program.key(),
        rent_exempt = enforce,
        token::mint = mint,
        token::authority = vault,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub clock: Sysvar<'info, Clock>,
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct Withdraw<'info> {

    ///the recipient of token account
    #[account(
        mut,
        constraint = beneficiary.mint == mint.key() @ErrorCode::InvalidMintMismatch,
    )]
    pub beneficiary: Account<'info, TokenAccount>,

    // Vesting.
    #[account(
        mut,
        owner = id() @ErrorCode::InvalidVestingOwner,
        constraint = vesting.magic == 0x544D4C4B @ErrorCode::InvalidMagic,
        constraint = vesting.vault == vault.key() @ErrorCode::InvalidVaultMismatch,
        constraint = vesting.beneficiary == beneficiary.key() @ErrorCode::InvalidBeneficiaryMismatch,
    )]
    pub vesting: Box<Account<'info, Vesting>>,

    #[account(
        mut,
        constraint = vault.mint == mint.key() @ErrorCode::InvalidMintMismatch,
        seeds = [vesting.to_account_info().key.as_ref()],
        bump = vesting.nonce,
    )]
    pub vault: Account<'info, TokenAccount>,

    // #[account(
    //     seeds = [vesting.to_account_info().key.as_ref()],
    //     bump = vesting.nonce,
    // )]
    // pub vesting_signer: AccountInfo<'info>,
    #[account(address = vesting.mint @ErrorCode::InvalidMintMismatch,)]
    pub mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub clock: Sysvar<'info, Clock>,
}


#[derive(Accounts)]
pub struct CancelVesting<'info> {

    #[account(mut)]
    pub granter: Signer<'info>,

    #[account(
        mut,
        constraint = sender.mint == mint.key()  @ErrorCode::InvalidMintMismatch,
        associated_token::mint = mint,
        associated_token::authority = granter,
    )]
    pub sender: Account<'info, TokenAccount>,

    #[account(
        mut,
        close = granter,
        owner = id() @ErrorCode::InvalidVestingOwner,
        constraint = vesting.magic == 0x544D4C4B @ErrorCode::InvalidMagic,
        constraint = vesting.vault == vault.key() @ErrorCode::InvalidVaultMismatch,
        constraint = vesting.granter == granter.key() @ErrorCode::InvalidGranterMismatch,
        constraint = vesting.sender == sender.key() @ErrorCode::InvalidSenderMismatch,
    )]
    pub vesting: Box<Account<'info, Vesting>>,

    #[account(
        mut,
        close = granter,
        constraint = vault.mint == mint.key()  @ErrorCode::InvalidMintMismatch,
        seeds = [vesting.to_account_info().key.as_ref()],
        bump = vesting.nonce,
    )]
    pub vault: Account<'info, TokenAccount>,

    // #[account(
    //     seeds = [vesting.to_account_info().key.as_ref()],
    //     bump = vesting.nonce,
    // )]
    // pub vesting_signer: AccountInfo<'info>,
    #[account(address = vesting.mint @ErrorCode::InvalidMintMismatch,)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}


#[account]
pub struct Vesting {
    /// Magic bytes, always fill the string "TMLK"(timelock)
    pub magic: u32,
    ///contract version
    pub version: u32,
    /// Signer nonce.
    pub nonce: u8,
    ///The vesting id
    pub vesting_id: u64,
    ///The vesting name
    pub vesting_name: [u8; 32],
    /// The investor wallet address
    pub investor_wallet_address: [u8; 64],

    /// Amount of funds withdrawn
    pub withdrawn_amount: u64,
    /// Remaining amount of the tokens in the escrow account
    pub remaining_amount: u64,
    /// The starting balance of this vesting account, i.e., how much was
    /// originally deposited.
    pub total_amount: u64,

    /// Pubkey of the granter main account (signer)
    pub granter: Pubkey,
    /// Pubkey of the granter token account
    pub sender: Pubkey,
    /// Pubkey of the recipient token account
    pub recipient: Pubkey,
    /// Pubkey of the recipient main account
    pub beneficiary: Pubkey,
    /// Pubkey of the token mint
    pub mint: Pubkey,
    /// Pubkey of the account holding the locked tokens
    pub vault: Pubkey,

    /// Timestamp when stream was created
    pub created_ts: u64,
    /// Timestamp when the tokens start vesting
    pub start_ts: u64,
    /// Timestamp when all tokens are fully vested
    pub end_ts: u64,
    /// Internal billing time
    pub accounting_ts: u64,
    /// Timestamp of the last withdrawal
    pub last_withdrawn_at: u64,

    /// Time step (period) in seconds per which the vesting occurs
    pub period: u64,
    /// Vesting contract "cliff" timestamp
    pub cliff: u64,
    /// The rate of release at TGE
    pub tge_rate: u64,
    /// The amount of TGE release
    pub tge_amount: u64,
    ///Amount to be unlocked per time during linear unlocking
    pub unlock_amount: u64,
    
}

impl Default for Vesting {
    fn default() -> Vesting {
        unsafe { std::mem::zeroed() }
    }
}

pub fn available_for_withdrawal(vesting: &Vesting, current_ts: u64) -> u64 {

    if current_ts >= vesting.end_ts {
        return vesting.remaining_amount;
    }

    let mut available: u64 = 0;
    let interval = current_ts - vesting.accounting_ts;
    if interval > vesting.period {
        let unlocked = interval.checked_div(vesting.period).unwrap() * vesting.unlock_amount;
        available = unlocked + vesting.tge_amount - vesting.withdrawn_amount;
    }

    available
}


/// Do a sanity check with given Unix timestamps.
pub fn duration_sanity(now: u64, start: u64, end: u64, cliff: u64) -> bool {
    let cliff_cond = if cliff == 0 {
        true
    } else {
        start <= cliff && cliff <= end
    };

    now < start && start < end && cliff_cond
}

/// Returns a days/hours/minutes/seconds string from given `t` seconds.
pub fn pretty_time(t: u64) -> String {
    let seconds = t % 60;
    let minutes = (t / 60) % 60;
    let hours = (t / (60 * 60)) % 24;
    let days = t / (60 * 60 * 24);

    format!(
        "{} days, {} hours, {} minutes, {} seconds",
        days, hours, minutes, seconds
    )
}


#[error]
pub enum ErrorCode {
    #[msg("Invalid vesting schedule given.")]
    InvalidSchedule,
    #[msg("Vesting end must be greater than start and the current unix timestamp.")]
    InvalidTimestamp,
    #[msg("The number of vesting periods must be greater than zero.")]
    InvalidPeriod,
    #[msg("The TGE rate of vesting must be less than 100")]
    InvalidTGERate,
    #[msg("The cliff time must be less than vesting time.")]
    InvalidCliffTime,
    #[msg("The vesting deposit amount must be greater than zero.")]
    InvalidDepositAmount,
    #[msg("Balance must go up when performing a deposit")]
    InsufficientDepositAmount,
    #[msg("The vesting withdrawal amount must be greater than zero.")]
    InvalidWithdrawalAmount,
    #[msg("Invalid program address. Did you provide the correct nonce?")]
    InvalidProgramAddress,
    #[msg("Invalid associated token address. Did you provide the correct address?")]
    InvalidAssociatedTokenAddress,
    #[msg("Invalid vesting owner.")]
    InvalidVestingOwner,
    #[msg("Insufficient withdrawal balance.")]
    InsufficientWithdrawalBalance,
    #[msg("Tried to withdraw over the specified limit")]
    WithdrawLimit,
    #[msg("You do not have sufficient permissions to perform this action.")]
    Unauthorized,
    #[msg("Operation overflowed")]
    Overflow,
    #[msg("The mint mismatch.")]
    InvalidMintMismatch,
    #[msg("Invalid vesting magic.")]
    InvalidMagic,
    #[msg("The vault account mismatch.")]
    InvalidVaultMismatch,
    #[msg("The beneficiary account mismatch.")]
    InvalidBeneficiaryMismatch,
    #[msg("The granter account mismatch.")]
    InvalidGranterMismatch,
    #[msg("The sender account mismatch.")]
    InvalidSenderMismatch,
}
