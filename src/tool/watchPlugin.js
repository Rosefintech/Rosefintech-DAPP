const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
import { assetManagementAddress } from '@/api/contract.js';
import { findReplacementTx } from '@/tool/findReplacementTx.js';


const WatchMixin = {
  data() {
    return {


      authList: ['liquidity', 'schedule', 'rosManagement', 'UNI_2_LIQUIDITY', 'SWIFT_2_SCHEDULE', 'FALCO_2_MANAGEMENT','assetSwapRos'],
      startBlock: 0,
      pendingData: {},
      pendingTx: null,
      stateTimer: null,
      state: 0,
    };
  },
  watch: {
    '$store.state.address': {
      immediate: true,
      handler(value) {
        if (value && typeof this.watchAddress === 'function') {
          this.watchAddress();
        }
      },
    },
    '$store.state.token': {

      immediate: true,
      handler(value) {
        if (value && typeof this.watchToken === 'function') {
          this.watchToken();
        }
      },
    },
    '$store.state.auth': {

      immediate: true,
      handler(value) {
        if (value && typeof this.watchAuth === 'function') {
          this.watchAuth();
        }
      },
    },
  },
  beforeDestroy() {
    this.clearStateTimer();
  },
  methods: {

    doAuthRos2ETh() {
      this.doAuthRos2('assetSwapRos');
    },



    doAuthRos2ROSManagement() {
      this.doAuthRos2('rosManagement').then(res=>{
        console.log(res)

      })
    },


    doAuthRos2Schedule() {
      this.doAuthRos2('schedule');
    },


    doAuthRos2Liquidity() {
      this.doAuthRos2('liquidity').then(res=>{
        console.log(res);


      })
    },


    async doAuthRos2(contractName = 'liquidity') {
      this.$toast.clear();
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.authorizing'),
      });
      let txHash = '';
      try {
        const addressName = `${contractName}Address`;
        const contractAddress = await this.$store.state.ros[addressName];
        const rosContract = await this.$store.dispatch('asset/getTokenContract', 'ROS',);
        await rosContract.methods
          .approve(
            contractAddress,
            '500000000000000000000000'
          )
          .send({
            from: this.$store.state.address,
          })
          .on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, contractName);
          });

        console.log('after await');
        this.removeByTxHash(txHash);
        if (typeof this.onAuthOK === 'function'){
          this.onAuthOK(contractName);
        }
      } catch (error) {
        console.warn(error);
        this.removeByTxHash(txHash);
        this.$toast.clear();
        if (typeof this.onAuthFail === 'function'){
          this.onAuthFail(error, contractName);
        }









      }
    },

    async reqIsFalcoAuth2Management() {
      try {
        const falcoContract = await this.$store.dispatch('asset/getTokenContract', 'Falco');
        const falcoWei = await this.$store.dispatch('asset/getTokenBalance', 'Falco');
        const falcoBalance = new this.$web3.utils.BN(falcoWei);
        const allowanceWei = await falcoContract.methods
          .allowance(this.$store.state.address, assetManagementAddress)
          .call();
        const allowance = new this.$web3.utils.BN(allowanceWei);
        const isAuthFalco = allowance.gt(falcoBalance);
        this.$store.commit('ros/SET_AUTH_FALCO_2_MANAGEMENT', isAuthFalco);
      } catch (error) {
        console.warn(error);
      }
    },


    async doAuthFalco2Management() {
      this.$toast.clear();
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.authorizing'),
      });
      let txHash = '';
      try {
        const falcoContract = await this.$store.dispatch('asset/getTokenContract', 'Falco');
        await falcoContract.methods
          .approve(
            assetManagementAddress,
            '500000000000000000000000'
          )
          .send({
            from: this.$store.state.address,
          })
          .on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, 'FALCO_2_MANAGEMENT');
          });

        console.log('after await');
        this.removeByTxHash(txHash);
        if (typeof this.onAuthOK === 'function'){
          this.onAuthOK('FALCO_2_MANAGEMENT');
        }
      } catch (error) {
        console.warn(error);
        this.removeByTxHash(txHash);
        this.$toast.clear();
        if (typeof this.onAuthFail === 'function'){
          this.onAuthFail(error, 'FALCO_2_MANAGEMENT');
        }
      }
    },

    onReceiptOK(receipt, type) {
      console.log('onReceiptOK', receipt);
      this.clearStateTimer();
      if (this.authList.includes(type) && typeof this.onAuthOK === 'function') {
        this.onAuthOK(type);
      } else if (typeof this.onSendOK === 'function') {
        this.onSendOK(receipt, type);
      }
    },

    onReceiptFail(error, type) {
      console.log('onReceiptFail', error);
      this.assetSwap=false;
      this.clearStateTimer();
      if (this.authList.includes(type) && typeof this.onAuthFail === 'function') {
        this.onAuthFail(error, type);

      } else if (typeof this.onSendFail === 'function') {
        this.onSendFail(error, type);
      }
    },


    clearStateTimer() {
      if (this.stateTimer) {
        clearTimeout(this.stateTimer);
        this.stateTimer = null;
      }
    },

    /**
     *
     * @param {*} types:string[]
     * @returns
     */
    checkPending(types) {
      const pds = localStorage.getItem('pendingTxs');
      if (!pds) return;

      this.pendingData = JSON.parse(pds);
      const entries = Object.entries(this.pendingData);
      const list = entries.filter(([key, value]) => (
        key
        && types.includes(value.type)
        && value.tx.from.toLowerCase() === this.$store.state.address.toLowerCase()
      ));
      if (list.length <= 0) return;


      const pending = list[0][1];
      console.log('check pending', pending);
      if (!pending || !types.includes(pending.type)) return;

      this.$toast.loading({
        duration: 0,

        message: this.authList.includes(pending.type)
                  ? this.$t('message.authorizing')
                  : this.$t('message.handling')
      })
      console.log('repending', pending);
      this.startCheckState(pending.tx.hash, pending.type);
    },
/**
 *hash
 * @param {*} hashhash
 * @param {*} contractName
 */
    startCheckState(hash, contractName) {
      this.waitGetReceipt(hash, contractName);
    },

    waitGetReceipt(hash, contractName) {
      this.clearStateTimer();
      this.stateTimer = setTimeout(() => {
        this.reqHashState(hash, contractName);
      }, 3000);
    },

    /**
     *search hash
     * @param {*} hashhash
     * @param {*} contractName
     * @returns
     */
    async reqHashState(hash, contractName) {
      console.log('hash: ', hash, contractName);
      if (!this.stateTimer || !hash) {
        return;
      }

      const pending = this.findTxInPending(hash);
      try {
        const transaction = await this.$web3.eth.getTransaction(hash);
        if (transaction) {
          this.addToPending(transaction, contractName);
          if (!transaction.blockHash) {

            this.waitGetReceipt(hash, contractName);
          } else {

            const receipt = await this.$web3.eth.getTransactionReceipt(hash);
            console.log('receipt', receipt, 'transaction', transaction);
            this.onReceiptOK(receipt, contractName);
            this.removeFromPending(transaction);
          }
        } else if (pending && !transaction) {
          const receipt = await findReplacementTx(this.$web3, pending.startBlock, pending.tx);
          console.log('replacement receipt', receipt);
          this.onReceiptOK(receipt, contractName);
          this.removeFromPending(pending.tx);
        } else if (pending) {
          this.onReceiptFail(new Error(hash), contractName);
          this.removeFromPending(pending.tx);
        }
      } catch (error) {
        console.log(error);
        this.onReceiptFail(error, contractName);
        if (pending && pending.tx) {
          this.removeFromPending(pending.tx);
        }
      }
    },

    async addToPending(transaction, type) {
      if (!transaction) return;
      const key = transaction.nonce;
      const startBlock = await this.$web3.eth.getBlockNumber();
      this.pendingData[key] = {
        type,
        startBlock,
        tx: transaction,
      }

      localStorage.setItem('pendingTxs', JSON.stringify(this.pendingData));
    },

    removeFromPending(transaction) {
      if (!transaction) return;
      const { nonce } = transaction;
      if (nonce in this.pendingData || String(nonce) in this.pendingData) {
        delete this.pendingData[String(nonce)];
      }

      console.log('remove', transaction, ' removed: ', this.pendingData);
      localStorage.setItem('pendingTxs', JSON.stringify(this.pendingData));
    },

    removeByTxHash(hash) {
      if (!hash) return;
      console.log('remove hash: ', hash);

      for (let [key, value] of Object.entries(this.pendingData)) {
        if (value.tx && value.tx.hash && (value.tx.hash.toLowerCase() === hash.toLowerCase())) {
          delete this.pendingData[key];
        }
      }

      localStorage.setItem('pendingTxs', JSON.stringify(this.pendingData));
    },

    findTxInPending(hash) {
      if (!hash) return;
      let r = null;
      for (let key of Object.keys(this.pendingData)) {
        if (hash.toLowerCase() === this.pendingData[key].tx.hash.toLowerCase()) {
          r = this.pendingData[key];
        }
      }

      return r;
    },


    sendV3() {
      this.$web3.currentProvider.sendAsync({
        method: 'net_version',
        params: [],
        jsonrpc: "2.0"
      }, (err, result) => {
        const netId = result.result
        console.log(netId, result.result)
        const msgParams = JSON.stringify({
        types:{















          My: [{ name: 'msg', type: 'string'}]
        },


        primaryType: "My",
        domain:{





        },
        message:{


          contents:"Hello, world!"
        }
        })



        var from = this.$store.state.address

        console.log('CLICKED, SENDING PERSONAL SIGN REQ', 'from', from, msgParams)
        var params = [from, msgParams]
        console.dir(params)
        var method = 'eth_signTypedData_v3'

        this.$web3.currentProvider.sendAsync({
          method,
          params,
          from,
        }, (err, result) => {
          if (err) return console.dir(err)
          if (result.error) {
            alert(result.error.message)
          }
          if (result.error) return console.error('ERROR', result)
          console.log('TYPED SIGNED:' + JSON.stringify(result.result))
          console.log('result:', result);

          const recovered = sigUtil.recoverTypedSignature({ data: JSON.parse(msgParams), sig: result.result })
          console.log(JSON.parse(msgParams));
          if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
            alert('Successfully ecRecovered signer as ' + from)
          } else {
            alert('Failed to verify signer when comparing ' + result + ' to ' + from)
          }

        })

      })
    },
    /**
     *
     * let r = result.result.slice(2, 66)
          let s = result.result.slice(66, 130)
          let v = result.result.slice(130)
          console.log('r:', r, ' s: ', s, ' v: ', v)
     * @param {*} text
     * @returns
     */

    getSRVByPersonal(msg) {
      return new Promise((resolve, reject) => {
        const hxMsg = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const from = this.$store.state.address;
        const params = [hxMsg, from];
        const method = 'personal_sign';
        this.$web3.currentProvider.sendAsync({
          method,
          params,
          from,
        }, (err, result) => {
          if (err) return reject(err);
          if (result.error) return reject(result.error);

          const res = String(result.result);
          const r = res.slice(2, 66);
          const s = res.slice(66, 130);
          const v = '0x' + res.slice(130);
          resolve({
            msg,
            r,
            s,
            v,
          })
        })
      })
    }
  },
};

export default {
  install(Vue) {
    Vue.mixin(WatchMixin);
  },
};
