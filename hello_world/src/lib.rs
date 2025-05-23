// program_id: 3GkjcNj8NpfnUs8qiYGbcttfERNupxP9N28JFMbA6Guv

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};

// declare and export the program's entrypoint
entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult {
    // log a message to the blockchain
    msg!("Hello, world!");

    msg!("_program_id: {:?}", _program_id);

    msg!("_accounts: {:?}", _accounts);

    msg!("_instruction_data: {:?}", _instruction_data);

    let accounts_iter =  &mut _accounts.iter();

    msg!("accounts_iter: {:?}", accounts_iter);

    let _result = next_account_info(accounts_iter)?;

    let result2 = next_account_info(accounts_iter);

    let account = match result2 {
        Ok(account_info) => account_info,
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(err);
        }
    };

    msg!("account: {:?}", account);

    // gracefully exit the program
    Ok(())
}