use anchor_lang::prelude::*;
use std::mem;

declare_id!("EeYjBR5CXBe5BML86bf5e71uUUHojYSYvQ8r3Htiqo52");

#[program]
pub mod pj2_escrow_pda {
    use super::*;

    pub fn initialize(ctx: Context<InitializeEscrow>) -> Result<()> {
        let escrow_acc = &mut ctx.accounts.escrow;

        escrow_acc.from = ctx.accounts.from.key();

        escrow_acc.to = ctx.accounts.to.key();

        escrow_acc.amount = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(
        init,
        seeds = [b"escrow".as_ref(), from.key().as_ref(), to.key().as_ref()],
        bump,
        payer = from,
        space = mem::size_of::<EscrowAccount>())
    ]
    pub escrow: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub from: Signer<'info>,

    /// CHECK: This is the recipient's account, used only for PDA derivation and not deserialized.
    #[account(mut)]
    pub to: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct EscrowAccount {
    pub from: Pubkey,

    pub to: Pubkey,

    pub amount: u64,
}
