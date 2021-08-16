export default {
  install(Vue) {
    
    
    let isWaiting = false;
    Vue.directive('intervalclick', function(el, binding) {
      el.onclick = function() {
        if (isWaiting) return;
        isWaiting = true;
        if (!binding.value) {
          console.warn('no value');
          return;
        }
        const func = binding.value['func'];
        const time = binding.value['time'] || 350;
        if (typeof time !== 'number') {
          console.warn('no time');
          return;
        }
        const args = binding.value['params'] || [];
        setTimeout(() => {
          isWaiting = false;
        }, time || 350);
        func(...args);
      };
    });

    
    Vue.directive('focus', {
      
      inserted: function (el) {
        
        el.focus();
      }
    });
  },
};




