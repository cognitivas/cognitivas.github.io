function validateFields(){var e=document.getElementById("Name").value,t=document.getElementById("Gender").value,n=document.getElementById("Age").value,o=document.getElementById("consent_checkbox").checked,d=$("[name=Input]:checked").length,a=$("#Contacto").val(),u=!0;if(""!=a.trim()){const m=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;u=m.test(String(a).toLowerCase())}n>=18&&99>n&&("f"==t||"m"==t||"noBinario"==t||"Pref_no_responder"==t)&&e.length>3&&o&&d&&u?($("#submit_button").fadeTo(.1,1),$("#submit_button").prop("disabled",!1)):($("#submit_button").fadeTo(.1,.5),$("#submit_button").prop("disabled",!0))}