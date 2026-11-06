use super::*;
use soroban_sdk::{symbol_short, Env};

#[test]
fn hello_returns_the_greeting_target() {
    let env = Env::default();
    let contract_id = env.register(HelloWorld, ());
    let client = HelloWorldClient::new(&env, &contract_id);

    assert_eq!(
        client.hello(&symbol_short!("world")),
        symbol_short!("world")
    );
}
