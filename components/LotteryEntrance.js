import { abi, contractAddresses } from '../constants'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import React from 'react'
import { ethers } from 'ethers'
import { useNotification } from '@web3uikit/core'
import { Bell } from '@web3uikit/icons'

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = React.useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = React.useState(0)
    const [lastWinner, setLastWinner] = React.useState('')

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee'
    })

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        msgValue: entranceFee
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getNumberOfPlayers'
    })

    const { runContractFunction: getLastWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: 'getLastWinner'
    })

    async function updateUI() {
        const newEntranceFee = (await getEntranceFee()).toString()
        const newNumOfPlayers = (await getNumberOfPlayers()).toString()
        const newLastWinner = (await getLastWinner()).toString()
        setEntranceFee(newEntranceFee)
        setNumberOfPlayers(newNumOfPlayers)
        setLastWinner(newLastWinner)
    }

    React.useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, setEntranceFee])

    async function handleSucces(tx) {
        await tx.wait(1)
        updateUI()
        dispatch({
            type: "success",
            message: "Transaction Complete Successfully!",
            title: "Transaction Notification",
            position: "topR",
            icon: <Bell fontSize='50px' />
        })
    }

    async function handleError(err) {
        console.error(err, ':(')
        dispatch({
            type: "error",
            message: "Transaction Error!",
            title: "Transaction Notification",
            position: "topR",
            icon: <Bell fontSize='50px' />
        })
    }

    async function enterRaffleHandler() {
        await enterRaffle({
            onSuccess: handleSucces,
            onError: handleError
        })
    }

    return (
        <React.Fragment>
            <h1>Entrance Fee: {ethers.utils.formatUnits(entranceFee, 'ether')}ETH</h1>
            <button onClick={enterRaffleHandler}>Enter Raffle</button>
            <h2>Number of Players: {numberOfPlayers}</h2>
            <h2>Last Winner: {lastWinner}</h2>
        </React.Fragment>
    )
}