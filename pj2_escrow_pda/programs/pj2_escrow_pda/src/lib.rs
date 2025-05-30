use anchor_lang::prelude::*;
use std::mem::size_of;
declare_id!("EeYjBR5CXBe5BML86bf5e71uUUHojYSYvQ8r3Htiqo52");

#[program]
pub mod pj2_escrow_pda {
    use super::*;

    pub fn create_escrow(ctx: Context<CreateEscrow>, amount: u64) -> Result<()> {
        let escrow_acc = &mut ctx.accounts.escrow;

        escrow_acc.from = ctx.accounts.from.key();

        escrow_acc.to = ctx.accounts.to.key();

        escrow_acc.amount = amount;

        escrow_acc.bump = ctx.bumps.escrow;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(
        init,
        seeds = [b"escrow", from.key().as_ref(), to.key().as_ref()],
        bump,
        payer = from,
        space = 8 + size_of::<EscrowAccount>()
    )]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub from: Signer<'info>,

    /// CHECK: safe
    #[account(mut)]
    pub to: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct EscrowAccount {
    pub from: Pubkey,

    pub to: Pubkey,

    pub amount: u64,

    pub bump: u8,
}
