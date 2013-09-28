meteor-load-balancing
=====================

Example application demonstrating load balancing a meteor app using HAProxy


Open 5 terminal windows:

```bash
# term1
haproxy -f haproxy.cfg

# term2
./run

# term3
./run 2

# term4
./run 3

# term5
./run 4
```

Open http://localhost:3000/ in some browsers.


## Configuring syslog

HAProxy logs to syslog so that there is no downtime required by things like
logrotate.  On OSX, syslog is not set up to listen to network log requests so a bit of configuration is needed before you will be able to see HAProxy log messages.

To configure syslog on OSX:

1. Backup syslogd start up file
```bash
sudo cp /System/Library/LaunchDaemons/com.apple.syslogd.plist /System/Library/LaunchDaemons/com.apple.syslogd.plist.backup
```

2. Convert binary file to xml to be human readable / editable
```bash
sudo plutil -convert xml1 /System/Library/LaunchDaemons/com.apple.syslogd.plist
```

3. Edit `/System/Library/LaunchDaemons/com.apple.syslogd.plist` and add the following snippet under the sockets node
```xml
 <key>NetworkListener</key>
 <dict>
   <key>SockServiceName</key>
   <string>syslog</string>
   <key>SockType</key>
   <string>dgram</string>
 </dict>
```
Should read like this now
```xml
 <key>Sockets</key>
 <dict>
    <key>AppleSystemLogger</key>
    <dict>
        <key>SockPathMode</key>
        <integer>438</integer>
        <key>SockPathName</key>
        <string>/var/run/asl_input</string>
    </dict>
    <key>BSDSystemLogger</key>
    <dict>
        <key>SockPathMode</key>
        <integer>438</integer>
        <key>SockPathName</key>
        <string>/var/run/syslog</string>
        <key>SockType</key>
        <string>dgram</string>
    </dict>
    <key>NetworkListener</key>
    <dict>
        <key>SockServiceName</key>
        <string>syslog</string>
        <key>SockType</key>
        <string>dgram</string>
    </dict>
 </dict>
```

4. Save the file

5. Convert back to binary file
```bash
sudo plutil -convert binary1 /System/Library/LaunchDaemons/com.apple.syslogd.plist
```

6. Restart syslogd
```bash
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.syslogd.plist
sudo launchctl load /System/Library/LaunchDaemons/com.apple.syslogd.plist
```

7. Add the following entry to `/etc/syslog.conf`
```bash
local2.*  /var/log/haproxy.log
```

8. Include logging options in `haproxy.cfg` (already included in example haproxy.cfg)
<pre>
    global
       log 127.0.0.1  local2 debug
    defaults
       mode http
       option httplog
       log global
</pre>

9. Restart HAproxy


HAProxy output will now log to `/var/log/haproxy.log`

An easy way to view log output on OSX is to run `Console.app`

