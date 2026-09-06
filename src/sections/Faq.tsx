import { Section } from "../components/Section";
import styles from "./Faq.module.css";
import { Sentences } from "../components/Sentences";

const FAQS = [
  {
    q: "インストールしようとすると警告が出ます。",
    a: "macOS ではアプリのアイコンを右クリックして「開く」を選ぶと起動できます。Windows では「詳細情報」→「実行」で進めます。配布元の確認がまだ済んでいないために出る表示です。",
  },
  {
    q: "読み上げを使うには何が必要ですか。",
    a: "VOICEVOX を別途インストールして、起動しておく必要があります。StreamDock だけでは読み上げできません。話者の選択と試聴は StreamDock の中でできます。",
  },
  {
    q: "コメントビューアを使うのにログインは必要ですか。",
    a: "YouTube と Twitch それぞれでログインが必要です。両方使う必要はなく、使う配信サービスだけ接続すれば大丈夫です。",
  },
  {
    q: "動作環境を教えてください。",
    a: "macOS（Intel / Apple Silicon）と、Windows 10 / 11（64bit）に対応しています。",
  },
  {
    q: "料金はかかりますか。",
    a: "現在は、すべての機能を無料でお使いいただけます。アカウントの登録も必要ありません。今後、追加機能を有料にする可能性があります。",
  },
  {
    // ⚠ ここが不具合を知る唯一の経路。テレメトリもクラッシュレポートも取らない設計
    //   （プライバシーの節で「記録は一切取りません」と宣言している）ので、
    //   ユーザーが教えてくれなければ不具合は永久に見えない。この項目を消さないこと。
    q: "不具合を見つけたときや、要望があるときはどこへ連絡すればいいですか。",
    // ⚠ 返信の速さを約束しない。守れないと、連絡先を置いた目的（信用）を逆に削る。
    a: "streamdock.support@gmail.com までご連絡ください。個人で開発しているため、返信までお時間をいただくことがあります。",
  },
];

export function Faq() {
  return (
    <Section id="faq" eyebrow="よくある質問" title="使う前に気になること" tinted>
      <div className={styles.list}>
        {FAQS.map((faq) => (
          <details key={faq.q} className={styles.item}>
            <summary className={styles.question}>{faq.q}</summary>
            <p className={styles.answer}>
              <Sentences text={faq.a} />
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
