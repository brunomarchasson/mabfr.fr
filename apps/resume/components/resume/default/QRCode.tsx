import { use } from "react";
// import QRCodeN from "qrcode";
import styles from './QRCode.module.css'

export const QRCode = (props: { value: string }) => {
  const { value } = props;
  // const p = QRCodeN.toString(value, { type: "svg", margin: 4, width: 96 });
  return (
    <figure className={styles.qrCode + " qrCode"} aria-label="QR Code">
      {/* <Suspense>
        <QRCodeInner promise={p} />
      </Suspense> */}
    </figure>
  );
};

export const QRCodeInner = (props: { promise: Promise<string> }) => {
  const svg = use(props.promise);
  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default QRCode;
