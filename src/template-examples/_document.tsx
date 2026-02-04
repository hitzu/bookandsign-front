import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html
      lang="en"
    // dir='rtl'
    >
      <Head />
      <body data-pc-preset="preset-1" data-pc-sidebar-theme="dark" data-pc-sidebar-caption="true" data-pc-direction="ltr" data-pc-theme="dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
