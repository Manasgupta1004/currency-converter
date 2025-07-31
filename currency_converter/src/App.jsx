import { useState, useEffect } from 'react'
import './App.css'
import { countryList } from "./countryList"
const BASE_URL = "https://api.exchangerate-api.com/v4/latest"
function App() {
  const [fromcurrency, setfromcurrency] = useState("USD")
  const [tocurrency, settocurrency] = useState("INR")
  const [amount, setamount] = useState("1")
  const [msg, setmsg] = useState("")
  const [fromflag, setfromflag] = useState(`https://flagsapi.com/US/flat/64.png`)
  const [toflag, settoflag] = useState(`https://flagsapi.com/IN/flat/64.png`)

  const updateflag = (code, type) => {
    const countrycode = countryList[code]
    const flagurl = `https://flagsapi.com/${countrycode}/flat/64.png`
    if (type === "from") {
      setfromflag(flagurl)
    } else settoflag(flagurl)
  }
  const updateexchangerate = async () => {
    let amountvalue = parseFloat(amount);
    if (isNaN(amountvalue) || amountvalue < 1) {
      amountvalue = 1
      setamount("1")
    }
    const url = `${BASE_URL}/${fromcurrency}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      const rate = data.rates[tocurrency]
      if (!rate) {
        setmsg("Invalid currency selected or rate not found");
        return;
      }

      const finalAmount = (amountvalue * rate).toFixed(2); 
      setmsg(`${amountvalue} ${fromcurrency} = ${finalAmount} ${tocurrency}`);
    }
    catch (error) {
      setmsg("Error fetching data");
      console.error("api arror", error);
    }
  }
  useEffect(() => {
    updateflag(fromcurrency, "from")
    updateflag(tocurrency, "to")
    updateexchangerate()
  }, [fromcurrency, tocurrency])
  return (
    <div className="container">
      <h2>Currency-Converter</h2>
      <form onSubmit={(e) => {
        e.preventDefault()
        updateexchangerate()
      }}>
        <div className="amount">
          <p>Enter Amount</p>
          <input type="number"
            value={amount}
            onChange={(e) => {
              setamount(e.target.value)
            }} />
        </div>
        <div className="dropdown">
          <div className="from">
            <p>Form</p>
            <div className="select-container">
              <img src={fromflag} alt="from flag" />
              <select name="from" value={fromcurrency} onChange={(e) => {
                setfromcurrency(e.target.value)
              }}>
                {Object.keys(countryList).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <i className='fa-solid fa-arrow-right-arrow-left'></i>
          <div className="to">
            <p>To</p>
            <img src={toflag} alt="to flag" />
            <select name="to" value={tocurrency} onChange={(e) => {
              settocurrency(e.target.value)
            }}>
              {Object.keys(countryList).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="msg">{msg}</div>
        <button type='submit'> GET Exchange Rate </button>
      </form>
    </div>
  )
}

export default App
