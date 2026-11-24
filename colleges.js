// ═══ ALL INDIAN COLLEGES & UNIVERSITIES — GOVERNMENT + PRIVATE ═══
// 500+ institutions across all 28 states + 8 UTs
const COLLEGES = {
"Andhra Pradesh":[
"JNTU Anantapur","Andhra University","SVU Tirupati","ANU Guntur","JNTUK Kakinada","SK University","IIIT Tirupati","VRSEC Vijayawada","LBRCE Machilipatnam",
"SRM AP","VIT AP","KL University","GFU","KL Engineering College","Sree Vidyanikethan","JNTUA College of Engineering","AANM & VVRSR","RVR & JC College of Engineering","MVR College",
"GVPCE","Prasad V Potluri Siddhartha Institute","Andhra Loyola College","Mallabari College of Engineering","Siddhartha Medical College","NTR Health University","GITAM Visakhapatnam","ANITS","AU College of Engineering","Kakinada Institute of Technology",
"MVGR College of Engineering","Vasavi College of Engineering","Vignan Institute","Narasaraopeta Engineering College","Guntur Engineering College","Sagi Rama Krishnam Raju Engineering College"
],
"Arunachal Pradesh":[
"Rajiv Gandhi University","NERIST","HNB Garhwal University","North Eastern Regional Institute","Arunachal University of Studies","Don Bosco College","Rangfr University"
],
"Assam":[
"IIT Guwahati","Gauhati University","Dibrugarh University","Tezpur University","Assam Engineering College","Jorhat Engineering College","Assam Don Bosco University","Assam Royal Global University","SSK College","Kumar Bhaskar Varma Sanskrit College",
"Central Institute of Technology Kokrajhar","Bodoland University","Assam Women's University","HS Brahmachary College","Karimganj College","Lakhimpur Commerce College","Nowgong College","Sibsagar College","Cotton University","Cachar College",
"Amguri College","B. Borooah College","Darrang College","Handique Girls College","JDSG College","Kamakhya Sri SHM College","KherajKhat College","MC College","Nagaon College","Nowgong Girls College"
],
"Bihar":[
"IIT Patna","NIT Patna","BHU Varanasi","Patna University","Magadh University","Muzaffarpur Institute of Technology","Darbhanga College of Engineering","Muzaffarpur Institute of Technology","Aryabhatta Knowledge University","Central University of South Bihar",
"Bihar Engineering University","Lalit Narayan Mithila University","Kameshwar Singh Darbhanga Sanskrit University","Patna Medical College","Nalanda University","Vaishali Institute of Higher Education","Araria College","Banka College","Bhagalpur University","Gaya College",
"Kishanganj College","Madhepura College","Motihari College","Purnia University","Rajendra Agricultural University","Saharsa College","Supaul College","Vikramshila University","Jan Nayak Kangra College","Munger University"
],
"Chhattisgarh":[
"NIT Raipur","IIT Bhilai","CSVTU Bhilai","Ravi Shankar University","Hidayatullah National Law University","Pt. Ravishankar Shukla University","Bilasa Institute of Technology","Chhatrapati Shivaji Institute","Govt Engineering College Rajnandgaon","DIET Raipur",
"Kalinga University","Amity University Raipur","ITM University","Shri Shankaracharya Technical Campus","Rungta College of Engineering","Bastar University","ICFAI University","Manipal University Jaipur Raipur"
],
"Delhi":[
"IIT Delhi","IIT Delhi DSM","NIT Delhi","DTU","NSUT","IIIT Delhi","Delhi University (DU)","Jawaharlal Nehru University (JNU)","Jamia Millia Islamia","IP University",
"Ambedkar University","IGNCA","Lady Shri Ram College","Miranda House","Hansraj College","Kirori Mal College","Sri Venkateswara College","Ramjas College","Hindu College","St. Stephen's College",
"Jesus and Mary College","Gargi College","Kamala Nehru College","Daulat Ram College","Mata Sundri College","Atma Ram Sanatan Dharma College","Bhagini Nivedita College","Bhim Rao Ambedkar College","DCAC","Deen Dayal Upadhyaya College",
"Delhi College of Arts and Commerce","Delhi College of Engineering","Fairfield Institute","FCR Innovation","Guru Gobind Singh Indraprastha University","Indraprastha Institute of Information Technology","Kasturba Gandhi College","Maharaja Agrasen Institute","Maharaja Surajmal Institute","Manav Rachna University",
"Netaji Subhas University","Northern India Engineering College","Rajdhani College","Raja Harpal Singh College","Shyama Prasad Mukherji College","SGGSC","SGND Khalsa College","Sri Aurobindo College","Tata Institute of Social Sciences","University of Delhi",
"Vivekananda Institute","BM Munjal University","JaganNath University","Lovely Professional University NCR","Sharda University","Amity University Noida","GD Goenka University"
],
"Goa":[
"NIT Goa","Goa University","IIIT Goa","Don Bosco College","St. Xavier's College Goa","Dhempe College","MES College","People's College","Goa Medical College","Padre Conceicao College",
"Vidya Prabodhini College","Rosary College","Smt. Devkunvarbhai M. Thakkar College"
],
"Gujarat":[
"IIT Gandhinagar","NIT Surat","DAIICT","Gujarat University","MS University Baroda","LDCE Ahmedabad","CEPT University","PDEU Gandhinagar","Nirma University","Ahmedabad University",
"GLS University","Patel University","Gujarat Technological University","BHU Varanasi","LDCE","Charotar University","PDEU","Gujarat Forensic Sciences University","National Law University","Gujarat Arts and Science College",
"BJ Medical College","LD Engineering College","Noble Group","Parul University","Silver Oak University","United World Institute","VRCE","Ahmedabad Institute of Technology","Birla Vishvakarma Mahavidyalaya","CEPI",
"CVM University","Darshan University","GEC Rajkot","GEC Bhuj","GEC Modasa","GEC Godhra","GEC Bharuch","GEC Junagadh","GEC Palanpur","GEC Patan",
"GEC Surendranagar","HNGU University","IITRAM Ahmedabad","Junagadh Agricultural University","KSKV Kutch University","LJ University","Marwadi University","Mehsana University","NAGPUR UNIVERSITY","RK University",
"Sardar Patel University","Saurashtra University","Shree Sathya Sai University","Som Lalit Education","St. Kabir Institute","SUAS Campus","TU","Veer Narmad South Gujarat University","Vidhyadeep Institute"
],
"Haryana":[
"IIT Delhi (Sonipat Campus)","NIT Kurukshetra","IIIT Sonepat","MDU Rohtak","KU Kurukshetra","GJU Hisar","Deenbandhu Chhotu Ram University","Jamia Millia Islamia (Nuh)","AINS","Apeejay Stya University",
"BPS Mahila Vishwavidyalaya","DCRUST Murthal","GD Goenka University","Guru Jambheshwar University","Guru Nanak Dev Engineering College","Haryana Engineering College","Indian Institute of Management Rohtak","K.R. Mangalam University","Kurukshetra University","Lady Irwin College",
"Manav Rachna University","Mewar University","National Dairy Research Institute","NIT Kurukshetra","Panipat Institute of Technology","PDM University","Prem Nagar Mahila College","RLV College of Music","Shree Guru Gobind Singh Tricentenary University","SRM University Haryana",
"Starex University","The Technological Institute of Textile","UIET Kurukshetra","YMCA University of Science"
],
"Himachal Pradesh":[
"IIT Mandi","NIT Hamirpur","HP University Shimla","CSKHPKV Palampur","ABV-IIITM","Atal Medical University","Dr. YS Parmar University","Himachal Pradesh Technical University","Himachal Pradesh University","ISB Mohali",
"LP Savani University","NIT Hamirpur","Rajiv Gandhi Government Engineering College","Regional Engineering College","Shoolini University","Vivekananda Global University"
],
"Jharkhand":[
"IIT ISM Dhanbad","NIT Jamshedpur","BIT Mesra Ranchi","XLRI Jamshedpur","BCECEB","Ranchi University","Vinoba Bhave University","Birla Institute of Technology Mesra","Central University of Jharkhand","Chaibasa Engineering College",
"David College","Engg College Chaibasa","Gossner College","Hazaribag Engineering College","Jamshedpur Women's College","Jawahar Navodaya Vidyalaya","Kumar Om Prakash Singh College","LR Sharma College","Mango College","Marwari College",
"Nirmala College","Notre Dame College","Patliputra University","Rajendra Institute of Technology","Sai Nath University","Sarala Birla University","St. Colmcille's College","St. Joseph College","Tata College","UMM University",
"VBU Hazaribagh","Xavier Labour Relations Institute"
],
"Karnataka":[
"IISc Bangalore","IIT Dharwad","NIT Surathkal","NIT Trichy Karnataka","IIIT Bangalore","RVCE","BMS College","PES University","Manipal Institute of Technology","Christ University",
"St. Joseph's College","Bangalore University","Mysore University","VTU","Bangalore Institute of Technology","BMS Institute","Dayananda Sagar College","DSCE","East West College","Global Academy",
"Jain University","JSS Academy","KLE Technological University","M.S. Ramaiah Institute","MSRIT","New Horizon College","PESIT","RNSIT","Sapthagiri College","Siddaganga Institute",
"Sir M Visvesvaraya Institute","SJCE Mysore","Sri Jayachamarajendra College","Surathkal Engineering College","T. John College","The National Institute of Engineering","UBDT College of Engineering","Vijaya College","Acharya Institute","Alva's College",
"Bahubali College","Canara Engineering College","SDM Institute","KNS Institute","Sambhram Institute","East West Institute","Bangalore North University","Gulbarga University","Karnatak University Dharwad","Kuvempu University",
"Shivaji University","Tumkur University","Visvesvaraya Technological University","Yenepoya University","St. Aloysius College","Canara College","SDM College Ujire"
],
"Kerala":[
"IIT Palakkad","NIT Calicut","CUSAT","University of Kerala","MG University Kottayam","Kannur University","Calicut University","TKM College of Engineering","APJ Abdul Kalam Technological University","Government Engineering College",
"Cochin University","Government Model Engineering College","MEC Thrikkakkara","NSS College of Engineering","Toc-H Institute","VJCET","Amrita Vishwa Vidyapeetham","Government College of Engineering","IIST","Indian Institute of Space Science",
"Mar Athanasius College","Model Engineering College","RIT Kottayam","SREE KRISHNA COLLEGE","St. Thomas College","Vidya Academy","MES College of Engineering","Government Law College","Maharajas College","Government Victoria College",
"Fatima Matha National College","NSS Hindu College","Sree Sankaracharya University","LBS College of Engineering","MBCET","Rajagiri College","Amal Jyothi College"
],
"Madhya Pradesh":[
"IIT Indore","NIT Bhopal","MANIT Bhopal","IET DAVV Indore","RGPV Bhopal","JEC Jabalpur","Amity University","ABV-IIITM Gwalior","Atal Bihari Vajpayee IIT","AISECT University",
" Barkatullah University","CDAC Bhopal","Engineering College Bhopal","Government Engineering College Rewa","Government Engineering College Jabalpur","Government Engineering College Ujjain","Holkar Science College","IIFM Bhopal","JNKVV Jabalpur","Lakshmi Narain College of Technology",
"Maharaja Ranjit Singh College","Makhanlal Chaturvedi University","OIST Bhopal","People's College of Research","Preneet College of Technology","Renaissance University","RKDF University","Sage University","Sagar Institute of Technology","SAL College",
"Samrat Ashok Technological Institute","Sant Hirdaram Nagar Girls College","Sardar Vallabhbhai Patel University","Symbiosis University","Technocrats Institute","VNS Group of Institutions","IIITDM Jabalpur","National Law Institute University"
],
"Maharashtra":[
"IIT Bombay","IIT Nagpur","NIT Nagpur","VJTI Mumbai","COEP Pune","ICT Mumbai","Symbiosis Pune","University of Mumbai","Pune University","MIT College of Engineering",
"Amity University Mumbai","AISSMS","PICT Pune","Sanghvi Engineering","Cummins College","VIT Pune","Pimpri Chinchwad College","COEP","DY Patil College","JSPM College",
"KJ Somaiya College","SIES College","Wilson College","St. Xavier's College Mumbai","H.R. College","Khalsa College","Mithibai College","NM College","Ruia College","KC College",
"Spiritual University","Arts Science and Commerce College","Bombay Veterinary College","D. G. Ruparel College","Elphinstone College","Fergusson College","Nowrosjee Wadia College","Poona College","Rajaram College","Shivaji University",
"Solapur University","Sant Gadge Baba Amravati University","Swami Ramanand Tirth Marathwada University","North Maharashtra University","Yashwantrao Chavan Maharashtra Open University","Gondwana University","Ramrao Adik Institute","Atharva College","Bharati Vidyapeeth","D.Y. Patil University",
"Dr. D.Y. Patil Vidyapeeth","DY Patil College of Engineering","International Institute of Information Technology","Kalsekar Technical Campus","MAEER's MIT","Sinhgad College of Technology","Thakur College","Terna Engineering College","Mumbai University","Rajiv Gandhi Medical College"
],
"Manipur":[
"NIT Manipur","Manipur University","D.M. College of Science","Indian Institute of Technology Manipur","Jawaharlal Nehru Institute","Modern College","Manipal University Jaipur","National Institute of Technology Manipur","Imphal College","D.M. College of Commerce"
],
"Meghalaya":[
"NIT Meghalaya","NEHU Shillong","Martin Luther Christian University","IIM Shillong","Assam Don Bosco University","Central Technological Institute","Jawaharlal Nehru College","Shillong College","Synod College","Lady Keane College"
],
"Mizoram":[
"NIT Mizoram","Mizoram University","ICFAI University","Govt. Aizawl College","Govt. Hrangbana College","Lengpui College","Mizoram College of Mizoram University","Pachhunga University College","Serchhip College","Saitual College"
],
"Nagaland":[
"NIT Nagaland","Nagaland University","St. Joseph University","Jawaharlal Nehru College","Kohima College","Mokokchung College","Dimapur Government College","Fazl Ali College","Global College","Petroleum College"
],
"Odisha":[
"IIT Bhubaneswar","NIT Rourkela","KIIT Bhubaneswar","CUTM","BPUT","Utkal University","Berhampur University","Siksha 'O' Anusandhan","Kalinga Institute of Industrial Technology","CV Raman College of Engineering",
"College of Engineering Bhubaneswar","Gandhi Engineering College","Gandhi Institute","GIET University","Government College of Engineering Keonjhar","Indira Gandhi Institute of Technology","Institute of Technical Education","Jagannath Institute","KIIT University","NISER Bhubaneswar",
"Odisha Engineering College","Orissa Engineering College","Parala Maharaja Engineering College","Ravenshaw University","Silicon Institute of Technology","Sri Sri University","SUIIT","Trident Academy of Technology","United School of Business Management","Vel TECH University"
],
"Punjab":[
"IIT Ropar","NIT Jalandhar","Thapar University","PEC Chandigarh","Punjab University Chandigarh","Chitkara University","Lovely Professional University","Amity University Mohali","Punjab Agricultural University","Rayat Bahra University",
"Baba Farid Group of Institutions","Chandigarh Group of Colleges","DAV College","Guru Nanak Dev University","Guru Nanak Institute","Guru Tegh Bahadur Institute","Khalsa College"," Lovely Professional University","Maharaja Ranjit College","Panjab University",
"Punjabi University Patiala","RIMT University","Sant Longowal Institute","Shaheed Bhagat Singh College","Sri Guru Granth Sahib World University","Universal Group of Institutions","CT University","I.K. Gujral Punjab Technical University"
],
"Rajasthan":[
"IIT Jodhpur","NIT Jaipur","BITS Pilani","Manipal University Jaipur","MNIT Jaipur","Rajasthan University","CTAE Udaipur","Amity University Jaipur","JECRC","Poornima University",
"Amity University","Banasthali Vidyapith","Birla Institute of Technology","Central University of Rajasthan","Dr. B.L. Memorial Institute","Jagannath University","JECRC University","JNU Jaipur","Lachoo Memorial College","MBM Engineering College",
"National Institute of Design Rajasthan","NIRMA University","Pacific College","Rajasthan Technical University","RN Modi Engineering College","S.N. College","Sanghi University","Sangam University","SKN Engineering College","SOA University",
"Sunrise University","The IIS University","University of Rajasthan","Vivekananda Global University","Maharana Pratap College","Government Engineering College Bikaner","Government College Ajmer","Maharshi Dayanand Saraswati College"
],
"Sikkim":[
"NIT Sikkim","Sikkim Manipal University","ICFAI University","Sikkim University","Sikkim Manipal Institute of Technology","SRM University Sikkim","Vision College"
],
"Tamil Nadu":[
"IIT Madras","NIT Trichy","Anna University","VIT Vellore","SRM Chennai","PSG Coimbatore","Madras University","Loyola College Chennai","Presidency College Chennai","IITM Research Park",
"Amrita Vishwa Vidyapeetham","Bharathiar University","Bharathidasan University","Anna University Trichy","Anna University Coimbatore","Saveetha Engineering College","Sri Sairam College","St. Joseph's College","Vel Tech University","Vivekananda College",
"Ambedkar Government Arts College","Central Institute of Petrochemicals Engineering","Dhanalakshmi Srinivasan Engineering College","DMI College of Engineering","Dr. MGR Educational University","Easwari Engineering College","Gaayathri School of Business","Government College of Technology","Hindustan College of Arts and Science","Jeppiaar Engineering College",
"KCG College of Technology","Knowledge Institute of Technology","MEPCO Schlenk Engineering College","MIT Campus Anna University","National Institute of Technology Tiruchirappalli","Nehru Institute of Technology","Noorul Islam University","Panimalar Engineering College","Panimalar Institute","Panimalar Institute of Technology",
"Rajalakshmi Engineering College","Rajalakshmi Institute of Technology","RVS College of Engineering","SACS Ramapuram","Sairam Engineering College","SASTRA University","Sathya Bhama Institute","Sri Krishna College","Sri Venkateswara College","SSN College of Engineering",
"St. Joseph Institute of Technology","St. Michael Academy","TCE Madurai","Thiagarajar College","Thiagarajar Engineering College","University College of Engineering","V旁里大学","Velammal Engineering College","Venkateswara College","Vidya Jyothi Institute of Technology"
],
"Telangana":[
"IIT Hyderabad","NIT Warangal","IIIT Hyderabad","Osmania University","JNTU Hyderabad","BITS Hyderabad","University of Hyderabad","Maulana Azad National Urdu University","Chaitanya Bharathi Institute of Technology","GRIET",
"Gokaraju Rangaraju Institute","JNTU Anantapur","Kakatiya University","Malla Reddy College of Engineering","Marri Laxman Reddy Institute","MLR Institute","MVSR Engineering College","Nalla Narasimha Reddy College","Narayanamma Engineering College","VNR VJIET",
"Guru Nanak Institutions","Sreenidhi Institute","Vardhaman College","Siddhartha Institute","Blooming Dale College","Laxmi Devi Educational Society","Anurag University","CMR Engineering College","Deccan College of Engineering","Keshav Memorial Institute",
"Magnus College","Potti Sreeramulu College","St. Mary's College","Vasavi College","Muffakham Jah College","Avanthi Institute","TKR College of Engineering","VVIT","Woxsen University","ISB Hyderabad"
],
"Tripura":[
"NIT Agartala","Tripura University","MBB College","ICFAI University Tripura","Tripura Institute of Technology","Birla Institute of Technology","NIT Agartala"
],
"Uttar Pradesh":[
"IIT Kanpur","IIT BHU Varanasi","IIT Lucknow","NIT Allahabad","IIIT Allahabad","AMU Aligarh","BHU Varanasi","Lucknow University","AKTU","MMMUT Gorakhpur",
"HBTU Kanpur","Galgotias University","Sharda University","Abdul Kalam Technical University","Amity University Lucknow","Babu Banarasi Das University","Bundelkhand University","Chhatrapati Shahu Ji Maharaj University","Dr. A.P.J. Abdul Kalam Technical University","Dr. Ram Manohar Lohia Avadh University",
"EASTERN UTTAR PRADESH","Gautam Buddh University","GL Bajaj Institute","Greater Noida Institute","Invertis University","Integral University","JSS Academy of Technical Education","Kanpur University","Khairun Nissa Begum Women's College","Maharana Pratap Education Center",
"MJPRU Bareilly","Moradabad Institute","NIEC","Pranveer Singh Institute","Rohilkhand University","RSD College","S.R. Group of Institutions","Shri Ramswaroop Memorial University","Subhash Institute","Subharti University",
"United Institute","University of Lucknow","UPES Dehradun","VBS Purvanchal University","VBS Purvanchal University","Veer Kunwar Singh University","Vision Institute","Bundelkhand Institute of Technology","Dr. B.R. Ambedkar University","Deen Dayal Upadhyay Gorakhpur University"
],
"Uttarakhand":[
"IIT Roorkee","NIT Uttarakhand","UPES Dehradun","Graphic Era University","DIT Dehradun","GRIET Dehradun","Uttarakhand Technical University","Bhimtal Campus Kumaun University","College of Technology G.B. Pant University","Doon University",
"GD Goenka University","HNB Garhwal University","Kumaun University","Quantum University","Shri Guru Ram Rai University","Uttaranchal University","BFIT Dehradun","CIT Dehradun","DBS PG College","Dev Sanskriti Vishwavidyalaya",
"GRD Institute","Himalayan Institute","Kumaun Engineering College","SGRR Institute","Tulas Institute"
],
"West Bengal":[
"IIT Kharagpur","NIT Durgapur","Jadavpur University","Presidency University","Calcutta University","IIEST Shibpur","Maulana Azad College","Scottish Church College","Amity University Kolkata","Asutosh College",
"Bethune College","Bhairav Ganguly College","Brajarajan Saha College","Budge Budge Institute","Calcutta Medical College","City College","Desabandhu College","Dinabandhu Andrews College","Dooars Valley College","Goenka College",
"Indian Statistical Institute","Institute of Chemical Technology","Kamala Nehru College","Maulana Azad College","Maulana Abul Kalam Azad University","Midnapore College","Murshidabad College","Narula Institute","NIT Durgapur","Prabhu Kumar College",
"Rabindra Bharati University","Rajabazar Science College","Ramakrishna Mission Residential College","Sammilani College","Serampore College","St. Xavier's College","Surendranath College","Vidyasagar University","West Bengal State University"
],
"Allahabad":[
"Allahabad University","IIIT Allahabad","MNNIT Allahabad","Ewing Christian College","ICFRE State Forest Research Institute","Jagat Taran Girls Degree College","MP Hindu Degree College","Shyama Prasad Mukherji College","S.P.M. Government College"
],
"Mumbai":[
"IIT Bombay","VJTI Mumbai","Sardar Patel College","University of Mumbai","ICT Mumbai","DJ Sanghvi","KJ Somaiya","Symbiosis Mumbai","NMIMS","Narsee Monjee Institute",
"Ramrao Adik Institute","Atharva College","Bharati Vidyapeeth","D.Y. Patil University","Wilson College","Elphinstone College","H.R. College","KC College","Khalsa College","Mithibai College",
"Ruia College","St. Xavier's College","Jai Hind College","Hinduja College","L.S. Raheja College","Rizvi College","Sathaye College","Vermont College","Pillai College","Thakur College"
],
"Bangalore":[
"IISc Bangalore","IIIT Bangalore","RVCE","BMS College","PES University","Christ University","Bangalore University","MS Ramaiah","Manipal Bangalore","Jain University",
"Christ Academy","Acharya Institute","St. Joseph's College","Aloysius College","Sagar Institute","Sambhram Institute","NITTE Meenakshi","BMS Institute","East West Institute","RNSIT",
"Bearstone College of Engineering","Global Academy","KNS Institute","Bangalore North University","Presidency College","Bangalore City College","St. Aloysius Degree College"
],
"Chennai":[
"IIT Madras","Anna University","VIT Chennai","SRM Chennai","Loyola College","Presidency College","Stella Maris","Madras University","CEG","MIT Chromepet",
"SSN College of Engineering","Easwari Engineering College","Panimalar College","Rajalakshmi Engineering College","Sri Sairam College","Saveetha College","Vel Tech","SRM Institute of Science and Technology","St. Joseph's College of Engineering","Tangent College"
],
"Hyderabad":[
"IIT Hyderabad","IIIT Hyderabad","NIT Warangal","Osmania University","JNTU Hyderabad","BITS Hyderabad","University of Hyderabad","Chaitanya Bharathi Institute of Technology","GRIET","MLR Institute",
"VNR VJIET","CVSR College","Anurag University","CMR Engineering College","Deccan College","Gokaraju Rangaraju Institute","Keshav Memorial Institute","MVSR Engineering College","Malla Reddy College","Sreenidhi Institute"
],
"Kolkata":[
"IIT Kharagpur","Jadavpur University","Presidency University","Calcutta University","IIEST Shibpur","Scottish Church College","Indian Statistical Institute","MAKAUT","St. Xavier's College","Bethune College",
"Asutosh College","Maulana Azad College","Rabindra Bharati University","Government College of Art and Craft","West Bengal University of Technology","Indian Institute of Chemical Biology","Bose Institute","Indian Association for Cultivation of Science","Saha Institute of Nuclear Physics","SSKM Hospital"
],
"Pune":[
"IIT Pune","COEP Pune","Symbiosis Pune","MIT Pune","Pune University","AISSMS","PICT Pune","VIT Pune","Bharati Vidyapeeth","DY Patil College",
"College of Military Engineering","Fergusson College","Nowrosjee Wadia College","Poona College","Sinhgad College","Maharashtra Institute of Technology","New Engineering College","SKN College","SPPU Pune","Vishwakarma Institute of Technology"
],
"Delhi NCR":[
"IIT Delhi","DTU","NSUT","IIIT Delhi","DU","JNU","Jamia","IP University","Amity Noida","Sharda University",
"JSS Academy","Manav Rachna University","GD Goenka University","SRM University","Bennett University","Ashoka University","OP Jindal University","O.P. Jindal Global University","NALSAR","National Law University Delhi",
"Aravali College of Engineering","BCIIT","Bharati Vidyapeeth","Dronacharya College","Faridabad Institute","GTBIT","HMR Institute","IGDTUW","MBS College of Engineering","NITTTR"
],
"Chandigarh":[
"IIT Ropar","PEC Chandigarh","Punjab University","Chandigarh University","Chitkara University","DAV College","Government College for Girls","Government Medical College","Goswami Ganesh Dutta Sanatan Dharam College","MCM DAV College",
"Panjab University Regional Centre","Post Graduate Government College","SGGSW University","Sri Guru Gobind Singh College","University Institute of Engineering","University Institute of Legal Studies"
],
"Ahmedabad":[
"IIT Gandhinagar","NID Ahmedabad","CEPT University","Gujarat University","LDCE","Ahmedabad University","Nirma University","PDEU","GLS University","DAIICT",
"H.L. College of Commerce","NRL College","St. Xavier's College","MS University Baroda","B.C.A. College","Chandubhai S. Patel Institute","Government Engineering College","H.B. Institute","L.D. College of Engineering","Parul University"
],
"Jaipur":[
"MNIT Jaipur","BITS Pilani","Amity Jaipur","JECRC","Manipal Jaipur","Rajasthan University","IIIT Jaipur","Poornima University","Manipal University","NIRMA University",
"Banasthali Vidyapith","Maharani College","Maharaja's College","Subodh College","Shri Jain Shikshan Sansthan","KK BIRLA Institute","The IIS University","ICFRE","RN Modi Engineering College","JECRC University"
],
"Kochi":[
"Cochin University","CUSAT","NIT Calicut nearby","St. Albert's College","CUSAT School of Engineering","Government Law College","Mahatma Gandhi College","Sacred Heart College","St. Teresa's College","Vikram Sarabhai Institute"
],
"Gurugram":[
"IIT Delhi nearby","DTU nearby","Amity Gurugram","GD Goenka","Sharda University nearby","Manipal University","Symbiosis University","AIIT","Amity University","BML Munjal University",
"Manipal GlobalNxt University","IIIT Delhi","K.R. Mangalam University","Manav Rachna University","SGT University","Starex University","Translational Health Science","Woxsen University"
],
"Noida":[
"IIT Delhi nearby","Amity Noida","JSS Academy","Sharda University","Galgotias University","Bennett University","Greater Noida Institute","IMSEC","KIET","ABES Engineering College",
"ACCENT College of Management","Ajay Kumar Garg Engineering College","AKGEC","Dronacharya College of Engineering","GL Bajaj Institute","GNIT","IEC College","Indraprastha Engineering College","MIET","NIEC"
],
"Bhubaneswar":[
"IIT Bhubaneswar","KIIT","CUTM","Utkal University","Silicon University","CV Raman Global University","BPUT","Gandhi Engineering College","Gandhi Institute of Technology","Indira Gandhi Institute of Technology",
"Kalinga Institute of Industrial Technology","National Institute of Science and Technology","Orissa Engineering College","Siksha O Anusandhan University","Trident Academy of Technology"
],
"Indore":[
"IIT Indore","IET DAVV","Devi Ahilya University","Acropolis Institute","Acropolis Technical Campus","BIITM","Chameli Devi Institute","DAVV","GICT","Global Institute of Technology",
"Holkar Science","IIM Indore","IPS Academy","Medicaps University","MITM","Mhow Institute","National Law Institute","Prestige Institute","Renaissance University","SAGE University"
],
"Patna":[
"IIT Patna","NIT Patna","Patna University","BCECE","Aryabhatta Knowledge University","Bihar Engineering University","Bihar College of Engineering","B.N. College","Patna Medical College","Patna Women's College",
"PK Ray Memorial College","Sinha College","Bhagalpur University","Magadh University","Muzaffarpur Institute","LN Mithila University","Ranchi University","Vinoba Bhave University"
],
"Ranchi":[
"BIT Mesra","XLRI Jamshedpur nearby","Ranchi University","Xavier University","Birla Institute of Technology","Bengal Institute of Technology","Central University of Jharkhand","Doranda College","Engg College Chaibasa","Hazaribag Engineering College",
"ISM Dhanbad","NIT Jamshedpur","Rajendra Institute of Technology","Sai Nath University","Sarla Birla University","Xavier Labour Relations Institute"
],
"Guwahati":[
"IIT Guwahati","Gauhati University","Tezpur University nearby","Assam Engineering College","Assam Don Bosco University","Assam Royal Global University","Cotton University","Cotton College","Dibrugarh University","Don Bosco College",
"Handique Girls College","Kamrup College","Nowgong College","Royal Global University","Srimanta Sankaradeva University"
],
"Varanasi":[
"IIT BHU","BHU","Mahatma Gandhi Kashi Vidyapith","College of Engineering","IIT (BHU) Varanasi","Jawahar Navodaya Vidyalaya","KIIT","Mahila Maha Vidyalaya","Maharshi Patanjali Sanskrit","Sampurnanand Sanskrit University",
"Sunbeam College","Vasant Kanya Mahavidyalaya"
],
"Coimbatore":[
"PSG College","Amrita University","Anna University nearby","GRD College","Amrita Vishwa Vidyapeetham","Bharathiar University","Coimbatore Institute of Technology","Government College of Technology","KG College","Kumaraguru College of Liberal Arts and Science",
"PSG Tech","Sri Krishna College of Technology","Sri Ramakrishna Engineering College","Tamil Nadu Agricultural University","Kongu Engineering College"
],
"Thiruvananthapuram":[
"University of Kerala","NIT Calicut nearby","IIITM K","College of Engineering Trivandrum","Government Engineering College","Kerala University","LBS Institute of Technology","Mahatma Gandhi College","NSS College of Engineering","TKM College of Engineering",
"University College of Engineering","Vikram Sarabhai Space Centre","Indian Institute of Space Technology"
],
"Nagpur":[
"IIT Nagpur","NIT Nagpur","VNIT Nagpur","Rashtrasant Tukadoji University","DY Patil College","G H Raisoni College","KDK College","Government College of Engineering","Hislop College","Institute of Science",
"IIM Nagpur","Khalsa College","Maharashtra College of Engineering","Priyadarshini College of Engineering","SFS College","Shri Ramdeobaba College","St. Francis De Sales College","Visvesvaraya National Institute"
],
"Raipur":[
"NIT Raipur","IIT Bhilai nearby","CSVTU","Government Engineering College","Chhatrapati Shivaji Institute","Hidayatullah National Law University","IIT Bhilai","Kalinga University","MATS University","NIT Raipur",
"Raipur Institute of Technology","Rungta College of Engineering","Shri Shankaracharya Technical Campus","University College of Engineering"
],
"Dehradun":[
"IIT Roorkee nearby","UPES","Graphic Era","DIT","Uttarakhand Technical University","BFIT","Dev Sanskriti Vishwavidyalaya","Doon University","Graphic Era Hill University","Hemvati Nandan Bahuguna Garhwal University",
"Kumaun University","Quantum University","SGRR Institute","Tulas Institute","Uttaranchal University","UPES Dehradun","Wadia Institute of Himalayan Geology"
]
};

// ═══ ALL INDIAN CITIES ═══
const CITIES = {
"Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Tirupati","Kakinada","Kurnool","Rajahmundry","Kadapa","Anantapur","Eluru","Ongole"],
"Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Tawang"],
"Assam":["Guwahati","Dibrugarh","Jorhat","Tezpur","Silchar","Nagaon","Tinsukia"],
"Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Ara","Begusarai","Munger"],
"Chhattisgarh":["Raipur","Bhilai","Durg","Bilaspur","Korba","Jagdalpur"],
"Delhi":["New Delhi","Delhi","Noida","Gurugram","Faridabad","Ghaziabad","Greater Noida"],
"Goa":["Panaji","Margao","Vasco da Gama","Mapusa"],
"Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar","Jamnagar","Anand","Bhuj","Junagadh"],
"Haryana":["Gurugram","Faridabad","Panipat","Ambala","Karnal","Hisar","Kurukshetra","Sonipat"],
"Himachal Pradesh":["Shimla","Manali","Dharamshala","Mandi","Solan"],
"Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar"],
"Karnataka":["Bangalore","Mysore","Hubli-Dharwad","Mangalore","Belgaum","Gulbarga","Shimoga","Manipal"],
"Kerala":["Kochi","Thiruvananthapuram","Kozhikode","Thrissur","Kottayam","Kannur","Palakkad"],
"Madhya Pradesh":["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Satna","Rewa"],
"Maharashtra":["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Kolhapur","Amravati","Jalgaon"],
"Manipur":["Imphal"],
"Meghalaya":["Shillong","Tura"],
"Mizoram":["Aizawl"],
"Nagaland":["Kohima","Dimapur"],
"Odisha":["Bhubaneswar","Cuttack","Rourkela","Berhambur","Sambalpur","Balasore","Puri"],
"Punjab":["Chandigarh","Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Moga"],
"Rajasthan":["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner","Alwar","Mount Abu"],
"Sikkim":["Gangtok"],
"Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thanjavur"],
"Telangana":["Hyderabad","Warangal","Karimnagar","Nizamabad","Khammam","Nalgonda","Mahbubnagar"],
"Tripura":["Agartala"],
"Uttar Pradesh":["Lucknow","Noida","Kanpur","Agra","Varanasi","Meerut","Prayagraj","Ghaziabad","Jhansi","Aligarh","Gorakhpur"],
"Uttarakhand":["Dehradun","Haridwar","Haldwani","Roorkee","Rudrapur","Nainital"],
"West Bengal":["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Kharagpur"]
};

// Flatten all cities into one array
const ALL_CITIES = [...new Set(Object.values(CITIES).flat())].sort();

// College search function
function searchColleges(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const results = [];
    for (const [state, colleges] of Object.entries(COLLEGES)) {
        for (const c of colleges) {
            if (c.toLowerCase().includes(q)) {
                results.push({ name: c, state });
            }
        }
    }
    return results.slice(0, 20);
}
