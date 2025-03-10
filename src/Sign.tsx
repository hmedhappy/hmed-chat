import { SignInButton } from '@clerk/clerk-react'

export default function Sign() {
    return (
        <main className="chat">
            <header>
                <h1>Welcome to Achat</h1>
                <SignInButton mode='modal' withSignUp />
            </header>
        </main>
    )
}
