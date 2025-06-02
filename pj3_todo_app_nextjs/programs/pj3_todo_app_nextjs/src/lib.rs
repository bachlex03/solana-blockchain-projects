use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod states;
#[allow(unused_imports)]
use crate::{constants::*, errors::*, states::*};

declare_id!("3EtaCXFXmnUCpTFTEs4mmRQPVZmK4cdjuwwJ5QwPg9yE");

#[program]
pub mod pj3_todo_app_nextjs {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.authority = ctx.accounts.authority.key();

        user_profile.last_todo = 0;

        user_profile.todo_count = 0;

        Ok(())
    }

    pub fn add_todo_item(ctx: Context<AddTodo>, content: String, _last_todo: u8) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        let todo_account = &mut ctx.accounts.todo_account;

        todo_account.authority = ctx.accounts.authority.key();
        todo_account.idx = user_profile.last_todo;
        todo_account.marked = false;

        todo_account.content = content;

        user_profile.last_todo = user_profile.last_todo.checked_add(1).unwrap();
        user_profile.todo_count = user_profile.todo_count.checked_add(1).unwrap();

        Ok(())
    }

    pub fn mark_todo_item(ctx: Context<MarkTodo>, _todo_idx: u8) -> Result<()> {
        let toto_account = &mut ctx.accounts.todo_account;

        require!(!toto_account.marked, TodoError::AlreadyMarked);

        toto_account.marked = !toto_account.marked;

        Ok(())
    }

    pub fn remove_todo_item(ctx: Context<RemoveTodo>, _todo_idx: u8) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;

        user_profile.todo_count = user_profile.todo_count.checked_sub(1).unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [constants::USER_TAG,authority.key().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<UserProfile>()
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(content: String, _last_todo: u8)]
pub struct AddTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [constants::USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        payer = authority,
        seeds = [constants::TODO_TAG, authority.key().as_ref(), _last_todo.to_le_bytes().as_ref()],
        bump,
        space = 8 + std::mem::size_of::<TodoAccount>(),
    )]
    pub todo_account: Box<Account<'info, TodoAccount>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(todo_idx: u8)]
pub struct MarkTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [constants::USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        mut,
        seeds = [constants::TODO_TAG, authority.key().as_ref(), todo_idx.to_le_bytes().as_ref()],
        bump,
        has_one = authority,
    )]
    pub todo_account: Box<Account<'info, TodoAccount>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(todo_idx: u8)]
pub struct RemoveTodo<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [constants::USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        mut,
        close = authority,
        seeds = [constants::TODO_TAG, authority.key().as_ref(), todo_idx.to_le_bytes().as_ref()],
        bump,
        has_one = authority,
    )]
    pub todo_account: Box<Account<'info, TodoAccount>>,

    pub system_program: Program<'info, System>,
}
