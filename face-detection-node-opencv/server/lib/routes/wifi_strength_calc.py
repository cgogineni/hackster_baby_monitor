import shlex, subprocess

fo = open("wifi_strength.txt", "w")
p1 = subprocess.Popen(['iwconfig', 'wlan0'], stdout=subprocess.PIPE)
p2 = subprocess.Popen(['grep', '-i', 'signal'], stdin=p1.stdout, stdout=subprocess.PIPE)
p1.stdout.close()

output,err=p2.communicate()
print (output[23:25])
#fo.write(output[23:25])
fo.close()


