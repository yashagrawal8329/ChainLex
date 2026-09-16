// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ChainLexRegistry
 * @dev On-chain registry for anchoring legal document SHA-256 hashes and metadata.
 * Enables tamper-proof verification of contract authenticity and timestamp proof of existence.
 */
contract ChainLexRegistry {
    struct DocumentRecord {
        bytes32 docHash;
        address owner;
        uint256 timestamp;
        string title;
        string metadataURI;
        bool exists;
    }

    // Mapping from SHA-256 hash to DocumentRecord
    mapping(bytes32 => DocumentRecord) private _documents;
    
    // Array of all anchored document hashes for enumeration
    bytes32[] private _docHashes;

    // Custom errors
    error DocumentAlreadyExists(bytes32 docHash);
    error DocumentNotFound(bytes32 docHash);
    error InvalidHash();

    // Events
    event DocumentAnchored(
        bytes32 indexed docHash,
        address indexed owner,
        uint256 timestamp,
        string title,
        string metadataURI
    );

    /**
     * @notice Anchors a legal document hash on-chain with title and metadata reference.
     * @param docHash SHA-256 hash of the document bytes formatted as bytes32.
     * @param title User-provided contract title or title extracted from PDF.
     * @param metadataURI URI (IPFS / JSON pointer) containing analysis summary metadata.
     */
    function anchorDocument(
        bytes32 docHash,
        string calldata title,
        string calldata metadataURI
    ) external {
        if (docHash == bytes32(0)) revert InvalidHash();
        if (_documents[docHash].exists) revert DocumentAlreadyExists(docHash);

        _documents[docHash] = DocumentRecord({
            docHash: docHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            title: title,
            metadataURI: metadataURI,
            exists: true
        });

        _docHashes.push(docHash);

        emit DocumentAnchored(
            docHash,
            msg.sender,
            block.timestamp,
            title,
            metadataURI
        );
    }

    /**
     * @notice Verifies if a given document SHA-256 hash has been anchored on-chain.
     * @param docHash SHA-256 hash to look up.
     * @return exists True if document was anchored.
     * @return owner Wallet address that anchored the document.
     * @return timestamp Block timestamp when anchored.
     * @return title Title of the document.
     * @return metadataURI Associated metadata URI.
     */
    function verifyDocument(bytes32 docHash)
        external
        view
        returns (
            bool exists,
            address owner,
            uint256 timestamp,
            string memory title,
            string memory metadataURI
        )
    {
        DocumentRecord memory record = _documents[docHash];
        if (!record.exists) {
            return (false, address(0), 0, "", "");
        }
        return (
            true,
            record.owner,
            record.timestamp,
            record.title,
            record.metadataURI
        );
    }

    /**
     * @notice Checks if a document hash is anchored.
     */
    function isAnchored(bytes32 docHash) external view returns (bool) {
        return _documents[docHash].exists;
    }

    /**
     * @notice Returns total number of anchored documents.
     */
    function getDocumentCount() external view returns (uint256) {
        return _docHashes.length;
    }

    /**
     * @notice Returns document details by index in history array.
     */
    function getDocumentByIndex(uint256 index)
        external
        view
        returns (
            bytes32 docHash,
            address owner,
            uint256 timestamp,
            string memory title,
            string memory metadataURI
        )
    {
        if (index >= _docHashes.length) revert DocumentNotFound(bytes32(0));
        bytes32 hash = _docHashes[index];
        DocumentRecord memory record = _documents[hash];
        return (
            record.docHash,
            record.owner,
            record.timestamp,
            record.title,
            record.metadataURI
        );
    }
}
