// program_id: Be3qLtbjhgvqLrXJ3SPDQXULH6DjLkvQhhSLr1YNDf8z

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

pub mod instruction;
use crate::instruction::HelloWorldInstruction;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreetingAccount {
    pub counter: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("::Entrypoint");
    msg!("var::program_id: {:?}", program_id);
    msg!("var::accounts: {:?}", accounts);
    msg!("var::_instruction_data: {:?}", instruction_data);

    let instruction = HelloWorldInstruction::unpack(instruction_data)?;

    let accounts_iter = &mut accounts.iter();

    msg!("::Iterating accounts: {:?}", accounts_iter);

    let account_info = next_account_info(accounts_iter)?;

    msg!("account_info: {:?}", account_info);

    // The account must be owned by the program in order to modify its data
    if account_info.owner != program_id {
        msg!("Greeted account does not have the correct program id");

        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the account data into a GreetingAccount struct
    let mut greeting_account = GreetingAccount::try_from_slice(&account_info.data.borrow())?;

    match instruction {
        HelloWorldInstruction::Increment => {
            greeting_account.counter += 1;
        }
        HelloWorldInstruction::Decrement => {
            greeting_account.counter -= 1;
        }
        HelloWorldInstruction::SetCounter(value) => {
            greeting_account.counter = value;
        }
    }

    msg!("greeting_account: {:?}", greeting_account);

    msg!("account_info.data: {:?}", account_info.data);

    msg!("Updated greeting_account: {:?}", greeting_account);

    // Serialize the updated greeting account back into the account's data
    greeting_account.serialize(&mut &mut account_info.data.borrow_mut()[..])?;

    msg!("Greeting account updated successfully");

    msg!("Greeted {} time(s)!", greeting_account.counter);

    Ok(())
}

// Sanity tests
#[cfg(test)]
pub mod tests {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;

    #[test]
    fn test_sanity() {
        let program_id = Pubkey::default();

        msg!("[TEST_LOG]::program_id: {:?}", program_id);

        let key = Pubkey::default();

        msg!("[TEST_LOG]::key: {:?}", key);

        let mut lamports = 0;

        msg!("[TEST_LOG]::lamports: {:?}", lamports);

        let owner = Pubkey::default();

        msg!("[TEST_LOG]::owner: {:?}", owner);

        let mut data = vec![0; mem::size_of::<u32>()];

        msg!("[TEST_LOG]::data: {:?}", data);

        msg!("[TEST_LOG]::Epoch::default(): {:?}", Epoch::default());

        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let arr2 = u32::to_le_bytes(100);
        let mut instruction_data = [2; 5];

        msg!("[TEST_LOG]::instruction_data length: {}", arr2.len());

        for i in 0..4 {
            instruction_data[i + 1] = arr2[i];
        }

        msg!("[TEST_LOG]::instruction_data: {:?}", instruction_data);

        let accounts = vec![account];

        msg!("[TEST_LOG]::accounts: {:?}", accounts);

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            0,
        );

        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            100,
        );

        let mut instruction_data = [0; 5];
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            101,
        );

        let mut instruction_data = [1; 5];
        process_instruction(&program_id, &accounts, &instruction_data).unwrap();

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            100,
        );
    }

    #[test]
    #[should_panic]
    fn test_crash() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;
        let owner = Pubkey::default();
        let mut data = vec![0; mem::size_of::<u32>()];

        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let arr2 = u32::to_le_bytes(100);
        let mut instruction_data = [1; 5];
        for i in 0..4 {
            instruction_data[i + 1] = arr2[i];
        }
        let accounts = vec![account];

        assert_eq!(
            GreetingAccount::try_from_slice(&accounts[0].data.borrow())
                .unwrap()
                .counter,
            0,
        );

        process_instruction(&program_id, &accounts, &instruction_data).unwrap();
    }
}
