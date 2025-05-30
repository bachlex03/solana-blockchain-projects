use anchor_lang::prelude::*;

declare_id!("3EtaCXFXmnUCpTFTEs4mmRQPVZmK4cdjuwwJ5QwPg9yE");

#[program]
pub mod pj3_todo_app_nextjs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
