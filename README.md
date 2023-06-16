1. truffle init: để tạo 1 số file và folder mẫu như: contracts, migrations, truffle-config.js
2. truffle migrate: để test code và build lên ganache và tạo ra 1 file .json theo đường dẫn đặt trong file truffle-config.js ở key: contracts_build_directory (url này trỏ tới đâu thì file json sẽ được tạo ở đó) hoặc copy code trong smart contract lên web: remix.ethereum.org
-> file .sol -> sol ở đây là solidity -> file .sol không thể kết nối tới thằng web3 mà thằng web3 sẽ tương tác kết nối tới file json này

Ở bước 2 nếu cần update lại code smart contract thì dùng lệnh: truffle migrate --reset