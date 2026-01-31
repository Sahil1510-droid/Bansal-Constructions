import tkinter as tk
from tkinter import filedialog, messagebox
import subprocess
import os
import webbrowser


# ---------- GIT COMMAND RUNNER ----------
def run_command(command, cwd):
    result = subprocess.run(
        command,
        cwd=cwd,
        shell=True,
        text=True,
        capture_output=True
    )
    if result.returncode != 0:
        error = result.stderr.strip() or result.stdout.strip()
        raise Exception(error)
    return result.stdout


def select_file():
    file = filedialog.askopenfilename()
    file_path.set(file)


def push_single_file():
    file = file_path.get().strip()
    repo_url = repo_url_entry.get().strip()
    commit_msg = commit_message_entry.get().strip()

    if not file or not repo_url or not commit_msg:
        messagebox.showerror("Error", "All fields are required")
        return

    folder = os.path.dirname(file)

    try:
        # Initialize git if needed
        if not os.path.exists(os.path.join(folder, ".git")):
            run_command("git init", folder)

        # Set remote safely
        run_command(f"git remote set-url origin {repo_url}", folder)

        # Ensure main branch
        run_command("git checkout -B main", folder)

        # Pull remote changes safely (FIXES YOUR ERROR)
        try:
            run_command("git pull origin main --rebase", cwd)
        except Exception:
            pass

        # Add ONLY selected file
        run_command(f'git add "{file}"', folder)

        # Commit
        run_command(f'git commit -m "{commit_msg}"', cwd)

        # Push
        run_command("git push -u origin main", folder)

        messagebox.showinfo("Success", "Upload completed successfully 🚀")

    except Exception as e:
        messagebox.showerror("Git Error", str(e))


# ---------- GUI ----------
root = tk.Tk()
root.title("GitHub Single File Push Tool")
root.geometry("540x340")
root.resizable(False, False)

file_path = tk.StringVar()

tk.Label(root, text="Select File").pack(pady=(15, 3))
tk.Entry(root, textvariable=file_path, width=65).pack()
tk.Button(root, text="Browse File", command=select_file).pack(pady=5)

tk.Label(root, text="GitHub Repository URL").pack(pady=(10, 3))
repo_url_entry = tk.Entry(root, width=65)
repo_url_entry.pack()

tk.Label(root, text="Commit Message").pack(pady=(10, 3))
commit_message_entry = tk.Entry(root, width=65)
commit_message_entry.pack()

tk.Button(
    root,
    text="Upload to GitHub",
    bg="#24292e",
    fg="white",
    padx=14,
    pady=6,
    command=push_single_file
).pack(pady=25)

root.mainloop()