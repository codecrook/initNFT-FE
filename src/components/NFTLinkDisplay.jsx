import Button from "./Button";

const NFTLinkDisplay = ({ contract, generatedNFT }) => {
    const nftURL = `https://testnets.opensea.io/assets/${contract}/${generatedNFT.toNumber()}`;
    const clickHandler = () => window.open(nftURL, '_blank');

    return (
        <div>
            <p className="sub-text">
                Hey there! We've minted your NFT and sent it to your wallet.
            </p>
            <Button className="cta-button opensea-button" onClick={clickHandler}>View NFT on OpenSea</Button>
        </div>
    )
}

export default NFTLinkDisplay;