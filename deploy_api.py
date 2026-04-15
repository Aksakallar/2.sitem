#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy API to VPS: 72.61.92.189
Usage: python deploy_api.py <ssh_password>
"""
import sys
import os
import io
import paramiko

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

VPS_HOST = "72.61.92.189"
VPS_PORT = 22
VPS_USER = "root"
LOCAL_OUT = r"c:\Users\Ak24k\OneDrive\Masaüstü\Test AI\mehmetasker\bo-backend\out\api"
REMOTE_DIR = "/var/www/mehmetasker/api"
SERVICE_NAME = "mehmetasker-api"

def run(ssh, cmd):
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    if out:
        print(f"  > {out}")
    if err:
        print(f"  ! {err}")
    return stdout.channel.recv_exit_status()

def upload_dir(sftp, local_dir, remote_dir):
    try:
        sftp.mkdir(remote_dir)
    except OSError:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        if os.path.isfile(local_path):
            sftp.put(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(sftp, local_path, remote_path)

def main():
    if len(sys.argv) < 2:
        print("Kullanım: python deploy_api.py <ssh_password>")
        sys.exit(1)

    password = sys.argv[1]

    print(f"[1/4] VPS'e bağlanılıyor: {VPS_HOST}")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, password=password)

    print(f"[2/4] Servis durduruluyor: {SERVICE_NAME}")
    run(ssh, f"systemctl stop {SERVICE_NAME} 2>/dev/null || true")

    print(f"[2b] Dizin olusturuluyor: {REMOTE_DIR}")
    run(ssh, f"mkdir -p {REMOTE_DIR}")

    print(f"[3/4] Dosyalar yukleniyor: {REMOTE_DIR}")
    sftp = ssh.open_sftp()
    upload_dir(sftp, LOCAL_OUT, REMOTE_DIR)
    sftp.close()

    print(f"[4/4] Servis başlatılıyor")
    run(ssh, f"chmod +x {REMOTE_DIR}/MehmetAsker.API")
    run(ssh, f"systemctl start {SERVICE_NAME}")
    run(ssh, f"systemctl status {SERVICE_NAME} --no-pager | head -5")

    ssh.close()
    print("\nDeploy tamamlandı!")

if __name__ == "__main__":
    main()
