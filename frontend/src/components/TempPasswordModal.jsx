import { useEffect, useRef, useState } from "react";
import { Printer, Copy, Check, KeyRound } from "lucide-react";
import { strings as S } from "../constants/strings";

export default function TempPasswordModal({
  isOpen,
  username,
  tempPassword,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      if (closeRef.current) closeRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !tempPassword) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '', 'width=420,height=320');
      if (!printWindow) return;
      const content = `<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="utf-8" />
<title>بيانات دخول ولي الأمر</title>
<style>
*{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;}
body{margin:24px;}
.title{font-size:18px;font-weight:bold;margin-bottom:8px;}
.row{margin:6px 0;}
.label{color:#666;}
.code{font-size:20px;font-weight:bold;letter-spacing:4px;}
.warn{color:#c25b4a;font-size:12px;margin-top:10px;}
</style>
</head>
<body>
<div class="title">بيانات الدخول</div>
<div class="row"><span class="label">اسم المستخدم:</span> ${username}</div>
<div class="row"><span class="label">كلمة المرور المؤقتة:</span> <span class="code">${tempPassword}</span></div>
<div class="warn">يجب تغيير كلمة المرور عند أول دخول</div>
<script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},250)},100);};<\/script>
</body>
</html>`;
      printWindow.document.write(content);
      printWindow.document.close();
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          aria-label={S.common.close}
        >
          ×
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-teal-100 text-teal-600">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          {S.users.tempPasswordTitle}
        </h3>
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
          {S.users.tempPasswordFor(username)}
        </p>
        <div
          className="flex items-center justify-between gap-3 rounded-xl p-4 mb-4"
          style={{
            backgroundColor: "#FCFAF4",
            border: "1px solid #F3EFE3",
          }}
        >
          <code
            className="text-lg font-bold tracking-widest text-left"
            style={{ color: "#2F3A36" }}
          >
            {tempPassword}
          </code>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:opacity-85"
              style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? S.users.tempPasswordCopied : S.users.tempPasswordCopy}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:opacity-85"
              style={{ backgroundColor: "#4C8577", color: "#FBF7EF" }}
            >
              <Printer size={15} />
              طباعة
            </button>
          </div>
        </div>
        <p className="text-xs text-amber-600 text-center leading-relaxed mb-6">
          {S.users.tempPasswordWarning}
        </p>
        <button
          ref={closeRef}
          onClick={onClose}
          className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {S.common.close}
        </button>
      </div>
    </div>
  );
}