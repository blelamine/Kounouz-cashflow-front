export default function InvoiceNumberFormatter(numb) {
  let n = numb.toString().length;
  if (n == 8) return numb.toString();
  else {
    let res = numb.toString().split("");
    return new Array(8 - n).fill("0").concat(res).join("").replaceAll(",", "");
  }
}
