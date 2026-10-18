import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TempPasswordModal from "./TempPasswordModal";

const USERNAME = "112233@kg.alittihad";
const TEMP_PASSWORD = "1234567890";

describe("TempPasswordModal", () => {
  test("renders nothing when closed", () => {
    const { container } = render(
      <TempPasswordModal isOpen={false} username={USERNAME} tempPassword={TEMP_PASSWORD} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing without a temp password", () => {
    const { container } = render(
      <TempPasswordModal isOpen username={USERNAME} tempPassword="" onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  test("shows username and temp password when open", () => {
    render(
      <TempPasswordModal isOpen username={USERNAME} tempPassword={TEMP_PASSWORD} onClose={() => {}} />
    );
    expect(screen.getByText(`اسم الدخول: ${USERNAME}`)).toBeInTheDocument();
    expect(screen.getByText(TEMP_PASSWORD)).toBeInTheDocument();
    expect(screen.getByText("إغلاق")).toBeInTheDocument();
  });

  test("copy button copies the temp password", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(
      <TempPasswordModal isOpen username={USERNAME} tempPassword={TEMP_PASSWORD} onClose={() => {}} />
    );
    fireEvent.click(screen.getByText("نسخ"));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(TEMP_PASSWORD));
    expect(await screen.findByText("تم النسخ")).toBeInTheDocument();
  });

  test("close button triggers onClose", () => {
    const onClose = jest.fn();
    render(
      <TempPasswordModal isOpen username={USERNAME} tempPassword={TEMP_PASSWORD} onClose={onClose} />
    );
    fireEvent.click(screen.getByText("إغلاق"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("print button opens a print window with the credentials", () => {
    const write = jest.fn();
    const close = jest.fn();
    const printWindow = { document: { write, close } };
    const openSpy = jest.spyOn(window, "open").mockReturnValue(printWindow);
    render(
      <TempPasswordModal isOpen username={USERNAME} tempPassword={TEMP_PASSWORD} onClose={() => {}} />
    );
    fireEvent.click(screen.getByText("طباعة"));
    expect(openSpy).toHaveBeenCalled();
    expect(write).toHaveBeenCalledWith(expect.stringContaining(USERNAME));
    expect(write).toHaveBeenCalledWith(expect.stringContaining(TEMP_PASSWORD));
    close();
    openSpy.mockRestore();
  });
});