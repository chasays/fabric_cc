# query transactions by amount

```sh
curl 'https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/37098/transactions/amount/123?timeout=30000' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en,zh-CN;q=0.9,zh;q=0.8' \
  -H 'Connection: keep-alive' \
  -b 'JSESSIONID=259464EE349C40A8E3A29619604F349C; _uetsid=7531bea0745911f0b3ea21cdde9b1b8e|1k9dp5v|2|fya|0|2046; _uetvid=7532ce80745911f0b2272f3cda04a62e|bv6vna|1754658813114|3|1|bat.bing.com/p/insights/c/y' \
  -H 'Referer: https://parabank.parasoft.com/parabank/findtrans.htm' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"'
```

## response 

```json
[
    {
        "id": 47110,
        "accountId": 37986,
        "type": "Debit",
        "date": 1754611200000,
        "amount": 101.00,
        "description": "Funds Transfer Sent"
    }
]
```

#   get customer id
```sh
curl 'https://parabank.parasoft.com/parabank/services_proxy/bank/customers/27641/accounts' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en,zh-CN;q=0.9,zh;q=0.8' \
  -H 'Connection: keep-alive' \
  -b 'JSESSIONID=8E7DABDF9D5DB6C32B38592E9A8B9CB9; _uetsid=7531bea0745911f0b3ea21cdde9b1b8e|1k9dp5v|2|fya|0|2046; _uetvid=7532ce80745911f0b2272f3cda04a62e|bv6vna|1754658813114|3|1|bat.bing.com/p/insights/c/y' \
  -H 'Referer: https://parabank.parasoft.com/parabank/overview.htm' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"'

  ```

## response

```json
[
    {
        "id": 37986,
        "customerId": 27641,
        "type": "CHECKING",
        "balance": 9799.00
    },
    {
        "id": 38097,
        "customerId": 27641,
        "type": "SAVINGS",
        "balance": 201.00
    }
]
```