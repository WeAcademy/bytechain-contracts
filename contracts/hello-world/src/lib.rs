#![no_std]

use soroban_sdk::{contract, contractevent, contractimpl, Env, Symbol};

/// Event emitted by [`HelloWorld::hello`].
#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Hello {
    #[topic]
    pub to: Symbol,
}

/// Minimal starter contract.
///
/// It exists so the workspace, the Soroban SDK and CI can be verified before
/// the real `ByteChainDAO`, `ByteChainCertificate` and `ByteChainToken`
/// contracts land. Replace this crate (or add sibling crates) when those
/// designs are approved.
#[contract]
pub struct HelloWorld;

#[contractimpl]
impl HelloWorld {
    /// Returns the greeting target and emits a `hello` event.
    pub fn hello(env: Env, to: Symbol) -> Symbol {
        Hello { to: to.clone() }.publish(&env);
        to
    }
}

#[cfg(test)]
mod test;
