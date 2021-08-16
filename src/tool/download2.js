





export function download(data, strFileName, strMimeType) {
  var self = window, 
    u = 'application/octet-stream', 
    m = strMimeType || u,
    x = data,
    D = document,
    a = D.createElement('a'),
    z = function(a) {
      return String(a);
    },
    B = self.Blob || self.MozBlob || self.WebKitBlob || z,
    BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
    fn = strFileName || 'download',
    blob,
    b,
    
    ua,
    fr;

  

  if (String(this) === 'true') {
    
    x = [x, m];
    m = x[0];
    x = x[1];
  }

  
  
  
  if (String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)) {
    return navigator.msSaveBlob 
      ? navigator.msSaveBlob(d2b(x), fn)
      : saver(x); 
  } 

  try {
    blob = x instanceof B ? x : new B([x], { type: m });
  } catch (y) {
    if (BB) {
      b = new BB();
      b.append([x]);
      blob = b.getBlob(m); 
    }
  }

  function d2b(u) {
    var p = u.split(/[:;,]/),
      t = p[1],
      dec = p[2] == 'base64' ? atob : decodeURIComponent,
      bin = dec(p.pop()),
      mx = bin.length,
      i = 0,
      uia = new Uint8Array(mx);

    for (i; i < mx; ++i) uia[i] = bin.charCodeAt(i);

    return new B([uia], { type: t });
  }

  function saver(url, winMode) {
    if ('download' in a) {
      
      a.href = url;
      a.setAttribute('download', fn);
      a.innerHTML = 'downloading...';
      D.body.appendChild(a);
      setTimeout(function() {
        a.click();
        D.body.removeChild(a);
        if (winMode === true) {
          setTimeout(function() {
            self.URL.revokeObjectURL(a.href);
          }, 250);
        }
      }, 66);
      return true;
    }

    
    var f = D.createElement('iframe');
    D.body.appendChild(f);
    if (!winMode) {
      
      
      url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, u);
    }

    f.src = url;
    setTimeout(function() {
      D.body.removeChild(f);
    }, 333);
  } 

  if (navigator.msSaveBlob) {
    
    return navigator.msSaveBlob(blob, fn);
  }

  if (self.URL) {
    
    saver(self.URL.createObjectURL(blob), true);
  } else {
    
    if (typeof blob === 'string' || blob.constructor === z) {
      try {
        return saver('data:' + m + ';base64,' + self.btoa(blob));
      } catch (y) {
        return saver('data:' + m + ',' + encodeURIComponent(blob));
      }
    }

    
    fr = new FileReader();
    
    fr.onload = function(e) {
      saver(this.result);
    };
    fr.readAsDataURL(blob);
  }
  return true;
} /* end download() */
