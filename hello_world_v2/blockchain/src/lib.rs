// program_id: Be3qLtbjhgvqLrXJ3SPDQXULH6DjLkvQhhSLr1YNDf8z

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("::Entrypoint");
    msg!("_instruction_data: {:?}", instruction_data);

    let accounts_iter =  &mut accounts.iter();

    let result = next_account_info(accounts_iter);

    let account = match result {
        Ok(account_info) => account_info,
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(err);
        }
    };


    msg!("account_info: {:?}", account);

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
      msg!("Greeted account does not have the correct program id"); 

      return Err(ProgramError::IncorrectProgramId);
    }

    Ok(())
}

