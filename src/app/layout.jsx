import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" sizes="97x97" />
      <body>
          {children}
      </body>
    </html>
  );
  
}


