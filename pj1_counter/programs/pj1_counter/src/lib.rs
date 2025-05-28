use anchor_lang::prelude::*;

declare_id!("9ivQ9UkUpATDYmhBxVwjXTMPvbnd32bzReqQhvZKamEF");

#[program]
pub mod pj1_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter_acc = &mut ctx.accounts.counter;

        counter_acc.count = 0;

        msg!("Counter initialized to: {}", counter_acc.count);

        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: u64) -> Result<()> {
        let counter_acc = &mut ctx.accounts.counter;

        counter_acc.count = data;

        msg!("Counter updated to: {}", counter_acc.count);

        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter_acc = &mut ctx.accounts.counter;

        counter_acc.count += 1;

        msg!("Counter incremented to: {}", counter_acc.count);
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let counter_acc = &mut ctx.accounts.counter;

        counter_acc.count -= 1;

        msg!("Counter decremented to: {}", counter_acc.count);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
