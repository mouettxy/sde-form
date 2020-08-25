
#Change FTP_ADDRESS with your FTP address. To ensure this works, visit the FTP address in your internet browser to get the right path
find dist -type f -exec curl -u $SFTP_USER:$SFTP_PASSWORD --ftp-create-dirs -T {} ftp://api.sde.ru.com/form/{} \;