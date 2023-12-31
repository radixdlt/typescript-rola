import type { SignedChallenge } from '@radixdlt/radix-dapp-toolkit'
import { PublicKey, RadixEngineToolkit } from '@radixdlt/radix-engine-toolkit'
import { ResultAsync, errAsync } from 'neverthrow'
import { typedError } from './typed-error'

const deriveVirtualIdentityAddress = (publicKey: string, networkId: number) =>
  ResultAsync.fromPromise(
    RadixEngineToolkit.Derive.virtualIdentityAddressFromPublicKey(
      new PublicKey.Ed25519(publicKey),
      networkId,
    ),
    typedError,
  )

const deriveVirtualEddsaEd25519AccountAddress = (
  publicKey: string,
  networkId: number,
) =>
  ResultAsync.fromPromise(
    RadixEngineToolkit.Derive.virtualIdentityAddressFromPublicKey(
      new PublicKey.Ed25519(publicKey),
      networkId,
    ),
    typedError,
  )

const deriveVirtualEcdsaSecp256k1AccountAddress = (
  publicKey: string,
  networkId: number,
) =>
  ResultAsync.fromPromise(
    RadixEngineToolkit.Derive.virtualAccountAddressFromPublicKey(
      new PublicKey.Secp256k1(publicKey),
      networkId,
    ),
    typedError,
  )

export const deriveVirtualAddress = (
  signedChallenge: SignedChallenge,
  networkId: number,
) => {
  if (signedChallenge.type === 'persona')
    return deriveVirtualIdentityAddress(
      signedChallenge.proof.publicKey,
      networkId,
    )
  else if (
    signedChallenge.type === 'account' &&
    signedChallenge.proof.curve === 'curve25519'
  )
    return deriveVirtualEddsaEd25519AccountAddress(
      signedChallenge.proof.publicKey,
      networkId,
    )
  else if (
    signedChallenge.type === 'account' &&
    signedChallenge.proof.curve === 'secp256k1'
  )
    return deriveVirtualEcdsaSecp256k1AccountAddress(
      signedChallenge.proof.publicKey,
      networkId,
    )

  return errAsync(new Error('Could not derive virtual address'))
}
