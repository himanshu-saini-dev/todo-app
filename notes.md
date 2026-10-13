# school task board detailed learning notes

### 1. state-driven architecture vs direct DOM manipulation
- purana galat tarika: screen par jakar sidhe element badalna ya li.remove chalana. isse JavaScript ka memory data aur screen aapas me lad padte hain.
- sahi tarika: hamara main sach hamari JavaScript array tasks aur filter variable hain. screen sirf ek aaina hai. jab bhi koi change hota hai, hum array ko update karte hain aur render function chalakar screen ko dobara paint kar dete hain.

### 2. Ram Chacha form handling pattern
1. e.preventDefault: browser ka natural form reload rokna.
2. read and clean: input dabbe se value nikal kar .trim chalana taaki faltu spaces hat jayein.
3. validation check: agar dabba khali hai toh code aage na badhe, turant return ho jaye.
4. save: Date.now se unique id banakar naya task object register array me push karna.
5. render: screen ko fresh data ke hisab se redraw karna.
6. reset: agle task ke liye input dabbe ko form.reset se saaf karna aur cursor wapas input par focus karna.

### Ram Chacha Formula (Form Handling Ka Asli Mantra)

Jab bhi form submit handle karna ho, yeh 6 steps follow karne hain:

- **Ram (Read):** `input.value` se dabba khol kar data nikalo
- **Chacha (Clean):** `.trim()` se faltu spaces hatao, number ke liye `Number()` lagao
- **Chai (Check):** check karo data valid hai ya nahi; agar galat ya khali hai toh `return` karke wahi roko
- **Se (Save):** `{ id, text, done: false }` bana kar seedhe state array me `push` karo
- **Samose (Show):** `render()` function call karo taaki screen fresh bahi-khate se update ho
- **Rakhte (Reset):** `form.reset()` chala kar agle grahak ke liye dabba saaf karo aur `input.focus()` karo

### 3. derived data principle
- jo data mojuda state se calculate ho sakta hai, usko kabhi alag variable me store nahi karte.
- pending count ke liye let pendingCount variable nahi banaya, kyunki kal ko delete ya add par count update karna bhool gaye toh bug aa jayega.
- isliye har render par freshly tasks.filter(t => !t.done).length se count nikala.

### 4. event delegation on ul
- har ek checkbox ya har ek delete button par alag se 50 listeners lagane ke bajaye unke parent ul par ek akela listener lagaya.
- jab bhi naya task add hota hai, uspar alag se listener nahi lagana padta.
- e.target.closest("li") se pata lagaya ki click kis task row par hua, aur fir uski dataset.id nikal kar filter ya map chala diya.

### 5. zero XSS vulnerability via textContent
- user ka input hamesha suspicious mana jata hai.
- agar user ne koi script ya <img src=x onerror=alert(1)> likha aur humne innerHTML use kiya, toh browser us script ko execute kar dega.
- document.createElement banakar textContent use karne se browser user ke input ko safe plain text ki tarah dikhata hai.

### 6. in-line editing workflow
- task ke span par dblclick sunte hi uski jagah ek temporary text input inject kiya.
- purana text usme pre-fill kar diya.
- enter dabane par ya input se focus hatne par (blur) array me naya text save karke render kiya, aur escape dabane par cancel karke purana render chala diya.

### 7. localStorage and nullish coalescing
- browser reload par data bachane ke liye localStorage me JSON.stringify karke array ko string banakar save kiya.
- app shuru hote waqt JSON.parse ke aage nullish coalescing operator ?? [] lagaya taaki pehli baar chalne par null ke bajaye ek safe empty array mile.