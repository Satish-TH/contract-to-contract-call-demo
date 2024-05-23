from algosdk import account, mnemonic

# create an account
private_key, address = account.generate_account()

# get the mnemonic associated with the account
mnemonic = mnemonic.from_private_key(private_key)

# write the credentials to a file
with open('credentials.txt', 'w') as file:
    file.write(f'public key: {address}\n')
    file.write(f'private key: {private_key}\n')
    file.write(f'mnemonic: {mnemonic}\n')
    print("Credentials Saved in 'credentials.txt' File")
