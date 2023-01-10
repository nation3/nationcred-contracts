const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

export function createActiveCitizen() {

    const padBuffer = (addr: any) => {
        return Buffer.from(addr.substr(2).padStart(32 * 2, 0), 'hex')
    }
    console.log("This is a Merkle tree for Nation3 active citizen")

    // Get list from active-citizen csv.
    let activeCitizen = []

    const leaves = activeCitizen.map(addr => padBuffer(addr))
    const merkletree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    console.log("merkletree", merkletree.toString())
    const rootHash = merkletree.getHexRoot()
    console.log("root hash", rootHash)
    return rootHash
} 