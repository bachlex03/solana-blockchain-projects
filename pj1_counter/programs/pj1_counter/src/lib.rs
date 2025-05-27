use anchor_lang::prelude::*;

declare_id!("Ak7pN2kCcUwntyNNThgGv1vqTWhbVxfNQJrEjCr1GH5t");

#[program]
pub mod pj1_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct Counter {
    pub count: u64,
}
