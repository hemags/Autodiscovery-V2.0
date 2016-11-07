#!/usr/bin/python

import subprocess
import sys
import re
import time
import datetime

def pid_json(pid):
	try:
		blist=[pid,'%cpu','%mem']
		var='ps -p %s -o %s,%s,cmd' %(blist[0],blist[1],blist[2])
		proc = subprocess.Popen(var, stdout=subprocess.PIPE,shell=True)
		output = proc.stdout.read()
		output=re.sub(' +',' ',output)
		output=re.sub('\n','',output)
		alist=output.split(' ',5)
		global dict1
		dict1={'PID':pid,'CPU':alist[3],'RAM':alist[4],'Process':alist[5]}
		return dict1
	except:
		fobj_log.write('\n Error Occured in pid_json() \n')


def ps_rollin():
	c_time=time.strftime("%c")
	fobj_log.write('\n\n\n ================================================= \n 	%s \n =================================================\n'%c_time)
	fobj_log.write('\n %s ==> Retrieving all the process data .....'%(datetime.datetime.today()))
	ps='ps -ef'
	psoc= subprocess.Popen(ps, stdout=subprocess.PIPE,shell=True)
	output=psoc.stdout.read()
	output=re.sub(' +',' ',output)
	#output=re.sub('\n',' \n ',output)
	alist=output.split('\n')
	length=len(alist)
	fobj_log.write('\n %s ==> Wrapping Processes Data into json .....'%(datetime.datetime.today()))
	del alist[length-1]
	del alist[0]
	fobj_log.write('\n %s ==> Eliminating unnecessary json lists .....'%(datetime.datetime.today()))
	pid_data={'data':[]}
	fobj_log.write('\n %s ==> Appending CPU and RAM data of each process to json string .....'%(datetime.datetime.today()))
	for list in alist:
		li_output=list.split(' ',6)
		li_json={'User-Id':li_output[0],'PID':li_output[1],'Parent_PID':li_output[2],'STARTUP_TIME':li_output[4]}
		pid_json(li_output[1])
		li_json.update(dict1)
		pid_data['data'].append(li_json)
	fobj_json_raw=open('../data_files/raw.json','wb')
	fobj_json_raw.write("%s"%pid_data)
	fobj_json_raw.close()
	fobj_log.write('\n %s ==> JSON data has been generated at /vagrant_data/data_files/raw.json .....'%(datetime.datetime.today()))

	ram=0.0
	for d in pid_data['data']:
		tmp = d['RAM']
		ram = ram + float(tmp)
	print ram

global fobj_log
fobj_log=open('../logs/generate.log','a+')
ps_rollin()
fobj_log.close()
