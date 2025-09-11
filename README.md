# Prototipe Blockchain untuk Layanan Publik

Proyek ini merupakan prototipe aplikasi Web3 untuk layanan pemerintah kabupaten, yang terdiri dari mobile wallet, Smart Contracts untuk identitas dan layanan publik, serta web app sebagai light client.

## Daftar Isi

1.  [Ikhtisar Proyek](#ikhtisar-proyek)
2.  [Prasyarat](#prasyarat)
3.  [Pengaturan dan Deployment](#pengaturan-dan-deployment)
    *   [Smart Contracts](#smart-contracts)
    *   [Mobile Wallet App](#mobile-wallet-app)
    *   [Web App (Light Client)](#web-app-light-client)
4.  [Menjalankan Aplikasi](#menjalankan-aplikasi)
    *   [Menjalankan Local Hardhat Node](#menjalankan-local-hardhat-node)
    *   [Menjalankan Mobile Wallet App](#menjalankan-mobile-wallet-app)
    *   [Menjalankan Web App](#menjalankan-web-app)
5.  [Fitur Utama](#fitur-utama)
6.  [Pengembangan Selanjutnya](#pengembangan-selanjutnya)

## Ikhtisar Proyek

Prototipe ini bertujuan untuk menampilkan sistem terdesentralisasi untuk layanan kabupaten menggunakan teknologi blockchain. Komponen utamanya meliputi:
*   **Mobile Wallet App:** Aplikasi React Native yang berfungsi sebagai identitas digital dan *signer* transaksi untuk warga dan petugas.
*   **Smart Contracts:** Kontrak Solidity yang di-deploy di blockchain EVM-compatible untuk manajemen identitas, Role-Based Access Control (RBAC), dan berbagai layanan publik (Dukcapil, Pendidikan, Sosial, Kesehatan).
*   **Web App (Light Client):** Portal React.js yang menyediakan antarmuka terpadu untuk warga, petugas, dan administrator untuk berinteraksi dengan blockchain.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

*   Node.js (v20 atau lebih tinggi direkomendasikan)
*   npm (Node Package Manager)
*   Git
*   Hardhat (untuk pengembangan Smart Contract dan local blockchain)
*   MetaMask (ekstensi browser untuk interaksi dengan web app)
*   Android Studio dengan Android Emulator atau perangkat fisik (untuk pengembangan mobile app)
*   Xcode dengan iOS Simulator atau perangkat fisik (jika menargetkan iOS)

## Pengaturan dan Deployment

### Smart Contracts

1.  **Masuk ke direktori `smart-contracts`:**
    ```bash
    cd smart-contracts
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Konfigurasi Hardhat untuk deployment ke Sepolia (Opsional):**
    *   Buat file `.env` di dalam direktori `smart-contracts`.
    *   Tambahkan Sepolia RPC URL dan private key Anda. **Jangan pernah commit private key Anda ke version control.**
        ```
        SEPOLIA_RPC_URL="YOUR_SEPOLIA_RPC_URL_HERE"
        PRIVATE_KEY="YOUR_ACCOUNT_PRIVATE_KEY_HERE"
        ```
    *   **Catatan:** `hardhat.config.ts` saat ini mengomentari konfigurasi jaringan Sepolia untuk kompilasi lokal. Jika Anda ingin deploy ke Sepolia, pastikan `.env` sudah diatur dan hapus komentar pada bagian `networks` di `hardhat.config.ts`.
4.  **Compile Smart Contracts:**
    ```bash
    npx hardhat compile
    ```
5.  **Deploy ke Local Hardhat Network (untuk development/testing):**
    *   Jalankan local Hardhat node di terminal terpisah:
        ```bash
        npx hardhat node
        ```
    *   **Penting:** Biarkan terminal ini tetap berjalan. Salin salah satu private key dari daftar akun yang ditampilkan.
    *   Deploy kontrak ke node lokal:
        ```bash
        npx hardhat run scripts/deploy.ts --network localhost
        ```
    *   **Salin alamat kontrak yang di-deploy.** Anda akan membutuhkannya untuk Mobile Wallet dan Web App.

### Mobile Wallet App

1.  **Masuk ke direktori `WalletMobileApp`:**
    ```bash
    cd WalletMobileApp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Konfigurasi Deep Linking (Langkah Manual):**
    *   **Untuk Android:**
        *   Buka `android/app/src/main/AndroidManifest.xml`.
        *   Di dalam tag `<activity>` yang memiliki `android:name=".MainActivity"`, tambahkan `<intent-filter>` berikut:
            ```xml
            <intent-filter android:label="react_native_deeplink">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="prototipeblockchain" android:host="open" />
            </intent-filter>
            ```
    *   **Untuk iOS:**
        *   Buka `ios/WalletMobileApp/Info.plist`.
        *   Tambahkan cuplikan XML berikut tepat sebelum tag `</dict>` terakhir:
            ```xml
            <key>CFBundleURLTypes</key>
            <array>
              <dict>
                <key>CFBundleURLSchemes</key>
                <array>
                  <string>prototipeblockchain</string>
                </array>
              </dict>
            </array>
            ```
4.  **Update Alamat Kontrak:**
    *   Buka `WalletMobileApp/src/constants/contracts.ts`.
    *   Ganti placeholder alamat kontrak dengan alamat yang Anda dapatkan setelah proses deployment.
    *   Pastikan URL `ethers.JsonRpcProvider` di dalam service files menunjuk ke node blockchain Anda (misalnya, `http://localhost:8545` untuk Hardhat lokal).

### Web App (Light Client)

1.  **Masuk ke direktori `webapp-light-client`:**
    ```bash
    cd webapp-light-client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Update Alamat Kontrak:**
    *   Buat file `.env.local` di direktori `webapp-light-client`.
    *   Tambahkan alamat kontrak yang telah di-deploy:
        ```
        VITE_RBAC_CONTRACT_ADDRESS="YOUR_RBAC_CONTRACT_ADDRESS"
        VITE_IDENTITY_CONTRACT_ADDRESS="YOUR_IDENTITY_CONTRACT_ADDRESS"
        VITE_DUKCAPIL_CONTRACT_ADDRESS="YOUR_DUKCAPIL_CONTRACT_ADDRESS"
        VITE_PENDIDIKAN_CONTRACT_ADDRESS="YOUR_PENDIDIKAN_CONTRACT_ADDRESS"
        VITE_SOSIAL_CONTRACT_ADDRESS="YOUR_SOSIAL_CONTRACT_ADDRESS"
        VITE_KESEHATAN_CONTRACT_ADDRESS="YOUR_KESEHATAN_CONTRACT_ADDRESS"
        ```

## Menjalankan Aplikasi

### Menjalankan Local Hardhat Node

*   Buka terminal baru.
*   Masuk ke direktori `smart-contracts`:
    ```bash
    cd smart-contracts
    ```
*   Jalankan Hardhat node:
    ```bash
    npx hardhat node
    ```
*   **Biarkan terminal ini tetap terbuka.** Node ini harus berjalan agar aplikasi dapat berinteraksi dengan blockchain.

### Menjalankan Mobile Wallet App

*   Buka terminal baru.
*   Masuk ke direktori `WalletMobileApp`:
    ```bash
    cd WalletMobileApp
    ```
*   Jalankan Metro, bundler JavaScript untuk React Native. Biarkan terminal ini tetap terbuka:
    ```bash
    npm start
    ```
*   Buka terminal **baru** lainnya.
*   Masuk lagi ke direktori `WalletMobileApp`:
    ```bash
    cd WalletMobileApp
    ```
*   Jalankan aplikasi di Android (pastikan emulator berjalan atau perangkat terhubung):
    ```bash
    npm run android
    ```
*   Atau di iOS:
    ```bash
    npm run ios
    ```
*   **Penggunaan:**
    *   Aplikasi akan membuat wallet baru jika belum ada.
    *   Anda dapat mendaftarkan identitas (NIK/NIP, Nama, dll.) ke `Identity` contract.
    *   Anda dapat melakukan transfer ETH.
    *   Anda dapat mengatur PIN untuk keamanan.
    *   Anda dapat menguji embedded WebView dengan memasukkan URL.

### Menjalankan Web App

*   Buka terminal baru.
*   Masuk ke direktori `webapp-light-client`:
    ```bash
    cd webapp-light-client
    ```
*   Jalankan development server:
    ```bash
    npm run dev
    ```
*   Buka browser Anda dan navigasikan ke URL yang disediakan oleh Vite (biasanya `http://localhost:5173`).
*   **Penggunaan:**
    *   Hubungkan wallet MetaMask Anda.
    *   **Admin Panel:** Memberikan *role* ke akun lain (misalnya, `DUKCAPIL_ROLE`).
    *   **Officer Panel (Dukcapil, dll.):** Memperbarui data sesuai departemen.
    *   **Citizen Panel:** Mendaftarkan identitas dan mengajukan permohonan.

## Fitur Utama

*   **Smart Contracts:**
    *   `Identity.sol`: Memetakan alamat wallet ke NIK/NIP.
    *   `RBAC.sol`: Role-Based Access Control menggunakan OpenZeppelin.
    *   Service Contracts (`LayananDukcapil.sol`, dll.): Fungsionalitas dasar untuk manajemen data dan aplikasi.
*   **Mobile Wallet App:**
    *   Pembuatan wallet dan penyimpanan private key secara lokal.
    *   Pendaftaran identitas.
    *   Fungsi transfer ETH.
    *   Keamanan dengan PIN dan Biometrik.
    *   Embedded WebView untuk memuat URL.
*   **Web App (Light Client):**
    *   Koneksi ke wallet (MetaMask).
    *   Dashboard berbasis peran untuk Admin, Officer, dan Citizen.
    *   Interaksi dengan blockchain melalui RPC.

## Pengembangan Selanjutnya

*   **Mobile Wallet App:**
    *   Implementasi penuh Deep Linking dan In-App Browser/Embedded WebView untuk alur kerja *signing* transaksi yang lebih mulus.
    *   Tingkatkan fitur keamanan (misalnya, integrasi *secure enclave*).
*   **Web App (Light Client):**
    *   Kembangkan alur kerja manajemen aplikasi yang lebih komprehensif (form detail, tracking status, notifikasi).
    *   Implementasikan fitur monitoring dan reporting yang lebih canggih untuk administrator.
*   **Infrastruktur Blockchain:**
    *   Deploy Smart Contracts ke testnet publik (misalnya, Ethereum Sepolia atau Polygon Mumbai).
    *   Setup dan kelola full node untuk pemerintah kabupaten/dinas.
*   **Dokumentasi:**
    *   Sempurnakan diagram alur, diagram aktivitas/urutan, dan materi demo.
    *   Dokumentasi teknis yang lebih detail untuk setiap komponen.
