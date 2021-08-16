export const openABI = [{
	"inputs": [{
		"internalType": "address",
		"name": "_addr",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "_call",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "_fundExchange",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "_exchange",
		"type": "address"
	}],
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "_prevOwner",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "address",
		"name": "_newOwner",
		"type": "address"
	}],
	"name": "OwnerUpdate",
	"type": "event"
}, {
	"inputs": [],
	"name": "FUND_EXCHANGE",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "FUND_MANAGE",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "_exchangeAddress",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "acceptOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_newOwner",
		"type": "address"
	}],
	"name": "changeOwner",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "enableOpenUp",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "getOpenUp",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "openTime",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_addr",
		"type": "address"
	}, {
		"internalType": "bool",
		"name": "_enable",
		"type": "bool"
	}],
	"name": "setAdmin",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "string",
		"name": "_symbol",
		"type": "string"
	}],
	"name": "setCurrentSymbol",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_addr",
		"type": "address"
	}],
	"name": "setExchangeAddress",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_fundExchange",
		"type": "address"
	}],
	"name": "setFundExchange",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "_time",
		"type": "uint256"
	}],
	"name": "setOpenTime",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "withdrawToken",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "nonpayable",
	"type": "function"
}];
