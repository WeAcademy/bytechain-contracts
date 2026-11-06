//! A minimal Soroban contract used to verify the workspace scaffolding.
//!
//! This contract will be replaced by real ByteChain contracts
//! (ByteChainDAO, ByteChainCertificate, ByteChainToken) once their
//! design docs are approved.

#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

/// A simple hello-world contract that stores and retrieves a greeting.
#[contract]
pub struct HelloWorld;

#[contractimpl]
impl HelloWorld {
    /// Store a greeting string in the contract's storage.
    pub fn set_greeting(env: Env, greeting: Symbol) {
        env.storage()
            .instance()
            .set(&symbol_short!("greeting"), &greeting);
    }

    /// Retrieve the stored greeting, or return "Hello" if none is set.
    pub fn get_greeting(env: Env) -> Symbol {
        env.storage()
            .instance()
            .get(&symbol_short!("greeting"))
            .unwrap_or(symbol_short!("Hello"))
    }

    /// Return a list of contract names planned for this workspace.
    pub fn contract_list(env: Env) -> Vec<Symbol> {
        vec![
            &env,
            symbol_short!("DAO"),
            symbol_short!("Cert"),
            symbol_short!("Token"),
        ]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_greeting() {
        let env = Env::default();
        let contract_id = env.register(HelloWorld, ());
        let client = HelloWorldClient::new(&env, &contract_id);

        let greeting = client.get_greeting();
        assert_eq!(greeting, symbol_short!("Hello"));
    }

    #[test]
    fn test_set_and_get_greeting() {
        let env = Env::default();
        let contract_id = env.register(HelloWorld, ());
        let client = HelloWorldClient::new(&env, &contract_id);

        client.set_greeting(&symbol_short!("ByteChain"));
        let greeting = client.get_greeting();
        assert_eq!(greeting, symbol_short!("ByteChain"));
    }

    #[test]
    fn test_contract_list() {
        let env = Env::default();
        let contract_id = env.register(HelloWorld, ());
        let client = HelloWorldClient::new(&env, &contract_id);

        let list = client.contract_list();
        assert_eq!(list.len(), 3);
        assert_eq!(list.get(0).unwrap(), symbol_short!("DAO"));
        assert_eq!(list.get(1).unwrap(), symbol_short!("Cert"));
        assert_eq!(list.get(2).unwrap(), symbol_short!("Token"));
    }
}
