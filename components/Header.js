import { ConnectWallet } from '@web3uikit/web3'
import React from 'react'

export default function Header() {
    return (
        <ConnectWallet moralisAuth={false} />
    )
}