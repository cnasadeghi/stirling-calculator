function stirling(n,k,kind='second',signed=false){
  let row=Array(k+1).fill(0n);row[0]=1n;
  for(let i=1;i<=n;i++){
    for(let j=Math.min(i,k);j>=1;j--)row[j]=row[j-1]+BigInt(kind==='second'?j:i-1)*row[j];
    row[0]=0n;
  }
  let value=row[k];
  return signed&&kind==='first'&&(n-k)%2?-value:value;
}
if(typeof module!=='undefined')module.exports={stirling};
