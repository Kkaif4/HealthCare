null_scenario = None

def funA(age):
    global null_scenario 
    null_scenario = age

Number = 10

funA(Number)
print(null_scenario)