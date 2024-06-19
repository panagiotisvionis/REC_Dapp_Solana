use anchor_lang::prelude::*;

declare_id!("9YgyLsBaGy8mU4X4k4CuPmcxhwkAcRD51mGvjWXkeMqn");

#[program]
pub mod my_rec_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn issue_rec(ctx: Context<IssueRec>, data: String) -> Result<()> {
        let rec_account = &mut ctx.accounts.rec_account;
        rec_account.data = data;
        Ok(())
    }

    pub fn verify_rec(ctx: Context<VerifyRec>, data: String) -> Result<bool> {
        let rec_account = &ctx.accounts.rec_account;
        if rec_account.data == data {
            Ok(true)
        } else {
            Ok(false)
        }
    }

    pub fn request_rec(ctx: Context<RequestRec>, kwh: u64) -> Result<()> {
        let request_account = &mut ctx.accounts.request_account;
        request_account.user = *ctx.accounts.user.key;
        request_account.kwh = kwh;
        Ok(())
    }

    pub fn issue_and_sell_rec(ctx: Context<IssueAndSellRec>, data: String, price: u64) -> Result<()> {
        let rec_account = &mut ctx.accounts.rec_account;
        rec_account.data = data;
        // Πώληση REC (Απλοποιημένο παράδειγμα)
        // Εδώ μπορείτε να προσθέσετε λογική μεταφοράς SOL από τον χρήστη στον παραγωγό
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? -= price;
        **ctx.accounts.producer.to_account_info().try_borrow_mut_lamports()? += price;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct IssueRec<'info> {
    #[account(init, payer = user, space = 8 + 64)]
    pub rec_account: Account<'info, RecAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyRec<'info> {
    pub rec_account: Account<'info, RecAccount>,
}

#[derive(Accounts)]
pub struct RequestRec<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub request_account: Account<'info, RequestAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IssueAndSellRec<'info> {
    #[account(init, payer = producer, space = 8 + 64)]
    pub rec_account: Account<'info, RecAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub producer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct RecAccount {
    pub data: String,
}

#[account]
pub struct RequestAccount {
    pub user: Pubkey,
    pub kwh: u64,
}
