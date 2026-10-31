export const PRACTICE_COPY = {
  uz:{
    roundupTitle:"Round Up 2 · kitob topshiriqlari",roundupTip:"Mavzuga mos betni tanlab, topshiriqlarni kitobning o‘zida bajaring.",
    baamTitle:"Baamboozle · jamoaviy o‘yin",baamTip:"Katak tanlang, 20 soniya ichida javob bering. Maxsus kataklarda qo‘shimcha ochko yutish yoki yo‘qotish mumkin.",
    vocabTitle:"Yangi so‘zlar · yodlab keling",vocabTip:"Tarjimani yashirib, so‘zlarni eslab ko‘ring.",
    reveal:"Tarjimani ko‘rsat",hide:"Tarjimani yashir",allReveal:"Barchasini ko‘rsat",allHide:"Barchasini yashir",
    check:"Tekshirish",again:"Qaytadan",right:"To‘g‘ri javob",score:"Natija",of:"/",teamCount:"Jamoalar soni",start:"O‘yinni boshlash",
    team:"Jamoa",turn:"Navbat",answer:"Javobni ko‘rsat",correct:"To‘g‘ri",incorrect:"Noto‘g‘ri",next:"Keyingi savol",newGame:"Yangi raund",
    finished:"Barcha savollar tugadi.",roundupDone:"Mashqlar yakunlandi.",translation:"Tarjima",pages:"Kitob betlari",page:"Bet",pageRange:"Betlar",openPdf:"PDF’ni alohida ochish",
    approximate:"Bu mavzu alohida sarlavha bilan yo‘q. Eng yaqin mavzu yoki takrorlash betlari tanlandi.",
    chooseTile:"Katak tanlang",points:"ochko",effects:{normal:"Oddiy",bonus:"Bonus +10",double:"Ikki karra ochko",steal:"Yetakchidan o‘g‘irlash",risk:"Xavf: xatoda ochko ketadi"},
    timerTip:"Javob berish uchun 20 soniya",used:"Ishlatilgan katak",winner:"G‘olib"
  },
  ru:{
    roundupTitle:"Round Up 2 · задания из книги",roundupTip:"Выберите подходящую страницу и выполняйте задания в самой книге.",
    baamTitle:"Baamboozle · командная игра",baamTip:"Выберите клетку и ответьте за 20 секунд. Специальные клетки дают бонусы или отнимают очки.",
    vocabTitle:"Новые слова · выучить",vocabTip:"Скройте перевод и проверьте, можете ли вспомнить слово.",
    reveal:"Показать перевод",hide:"Скрыть перевод",allReveal:"Показать все",allHide:"Скрыть все",
    check:"Проверить",again:"Заново",right:"Правильный ответ",score:"Результат",of:"/",teamCount:"Команд",start:"Начать игру",
    team:"Команда",turn:"Ход",answer:"Показать ответ",correct:"Верно",incorrect:"Неверно",next:"Следующий вопрос",newGame:"Новый раунд",
    finished:"Все вопросы закончились.",roundupDone:"Задания завершены.",translation:"Перевод",pages:"Страницы книги",page:"Страница",pageRange:"Страницы",openPdf:"Открыть PDF отдельно",
    approximate:"Этой темы нет отдельным заголовком. Показаны страницы ближайшей темы или повторения.",
    chooseTile:"Выберите клетку",points:"очков",effects:{normal:"Обычная",bonus:"Бонус +10",double:"Двойные очки",steal:"Забрать у лидера",risk:"Риск: ошибка отнимает очки"},
    timerTip:"На ответ даётся 20 секунд",used:"Клетка использована",winner:"Победитель"
  }
};
function practiceQuestions(l){
  const questions=[],seen=new Set();
  (l.tests||[]).flat().forEach(q=>{
    if(q&&q.q&&!seen.has(q.q)){seen.add(q.q);questions.push(q);}
  });
  return questions.slice(0,10);
}
const ROUND_UP_PAGES={
  1:[[3,11]],2:[[158,159]],3:[[12,23]],4:[[3,11]],5:[[12,23],[31,37]],6:[[134,135]],7:[[26,30]],8:[[54,59]],9:[[3,11]],10:[[44,53]],
  11:[[38,43]],12:[[52,53]],13:[[38,53]],14:[[56,59]],15:[[60,67]],16:[[116,118]],17:[[63,67]],18:[[136,137]],19:[[31,37]],20:[[72,77]],
  21:[[144,145]],22:[[144,145]],23:[[3,11]],24:[[36,37]],25:[[38,43]],26:[[38,53]],27:[[3,11]],28:[[84,89]],29:[[95,103]],30:[[95,103]],
  31:[[148,149]],32:[[152,154]],33:[[152,154]],34:[[152,154]],35:[[152,154]],36:[[114,115]],37:[[95,109]],38:[[150,151]],39:[[68,71],[110,115]],40:[[68,71]],
  41:[[110,115]],42:[[150,151]],43:[[110,115]],44:[[78,83]],45:[[78,83]],46:[[78,83]],47:[[72,77]],48:[[114,115]],49:[[31,37]],50:[[84,89]],
  51:[[119,123]],52:[[3,11],[44,53]],53:[[116,118]],54:[[152,154]],55:[[3,11],[44,53]],56:[[3,11]],57:[[72,77]],58:[[116,118]],59:[[63,67]],60:[[132,133]],
  61:[[116,118]],62:[[155,157]],63:[[3,11]],64:[[26,30]],65:[[12,23]],66:[[155,157]],67:[[63,67],[31,37]]
};
const ROUND_UP_APPROXIMATE=new Set([2,21,22,32,33,34,35,38,42,51,54,59,61,62,66]);
function rRoundUp(b,l){
  const copy=PRACTICE_COPY[LANG];
  const st=state[l.n]||(state[l.n]={lv:0,sel:{},inp:{},done:{}});
  const card=h("div","card");
  card.appendChild(h("h3",null,"📖 "+copy.roundupTitle));
  card.appendChild(h("p","tip",copy.roundupTip));

  // Round Up content sections
  const content=h("div","roundup-content");
  
  // Progress Check 1
  const pc1=h("section","roundup-section");
  pc1.id="roundup-pc1";
  pc1.appendChild(h("h2",null,"Progress Check 1"));
  const ex1=h("div","roundup-exercise");
  ex1.appendChild(h("h3",null,"Listen and draw lines. There is one example."));
  const ex1content=h("div","exercise-content");
  ex1content.innerHTML = `
    <p>We've got lots of food to eat</p>
    <p>These are apples</p>
    <p>That is meat</p>
    <p>It's dinner time</p>
    <p>We can make a tasty dish</p>
    <p>This is butter</p>
    <p>Those are fish</p>
    <p>You can have some food with me</p>
    <p>Those are burgers</p>
    <p>That is tea</p>
  `;
  ex1.appendChild(ex1content);
  // Image placeholder for picture exercise
  const img1=h("div","exercise-image");
  img1.innerHTML = `<div class="image-placeholder">[IMAGE: Listen and draw lines - food picture]</div>`;
  ex1.appendChild(img1);
  pc1.appendChild(ex1);
  content.appendChild(pc1);

  // Progress Check 2
  const pc2=h("section","roundup-section");
  pc2.id="roundup-pc2";
  pc2.appendChild(h("h2",null,"Progress Check 2"));
  const ex2=h("div","roundup-exercise");
  ex2.appendChild(h("h3",null,"Circle the correct item."));
  const ex2content=h("div","exercise-content");
  ex2content.innerHTML = `
    <ol>
      <li>This book is my <strong>/ mine</strong>.</li>
      <li>Mr Smith is their <strong>/ theirs</strong> teacher.</li>
      <li>This is our <strong>/ ours</strong> house.</li>
      <li>My <strong>/ Mine</strong> cat is black and white.</li>
      <li>This is Marks <strong>/ Mark's</strong> car. It's very fast.</li>
      <li>The black skirt is her <strong>/ hers</strong>.</li>
      <li>This is John's book. It is his <strong>/ her</strong>.</li>
      <li>This car is their <strong>/ theirs</strong>.</li>
      <li>Dr Black is her <strong>/ hers</strong> doctor.</li>
      <li>My friends <strong>/ friend's</strong> flat is very small.</li>
    </ol>
  `;
  ex2.appendChild(ex2content);
  pc2.appendChild(ex2);
  content.appendChild(pc2);

  // Progress Check 2 (page 37) - listening
  const pc2b=h("section","roundup-section");
  pc2b.id="roundup-pc2b";
  pc2b.appendChild(h("h2",null,"Progress Check 2 (Listening)"));
  const ex2b=h("div","roundup-exercise");
  ex2b.appendChild(h("h3",null,"Listen and tick (/) the box."));
  const ex2bcontent=h("div","exercise-content");
  ex2bcontent.innerHTML = `
    <p><strong>1</strong> What's in the basket? A [ ] B [ ] C [ ]</p>
    <p><strong>2</strong> Whose baby brother is he?</p>
    <p><strong>3</strong> What's on the table? A [ ] B [ ] C [ ]</p>
    <p><strong>4</strong> Whose bag is it?</p>
  `;
  ex2b.appendChild(ex2bcontent);
  pc2b.appendChild(ex2b);
  content.appendChild(pc2b);

  // Progress Check 3
  const pc3=h("section","roundup-section");
  pc3.id="roundup-pc3";
  pc3.appendChild(h("h2",null,"Progress Check 3"));
  const ex3=h("div","roundup-exercise");
  ex3.appendChild(h("h3",null,"Choose the correct item."));
  const ex3content=h("div","exercise-content");
  ex3content.innerHTML = `
    <ol>
      <li>She meat every day. A is eating B eat C <strong>eats</strong></li>
      <li>The baby at the moment. A is sleeping B sleeps C sleep</li>
      <li>I to bed every night at 10:00 pm. A am going B goes C go</li>
      <li>Dad TV now. A is watching B watches C watch</li>
      <li>Mother always the dishes. A is washing B washes C wash</li>
      <li>Jane a book at the moment. A is reading B reads C read</li>
      <li>She very quickly. Look! A is running B runs C run</li>
      <li>I my homework every day. A am doing B do C does</li>
    </ol>
  `;
  ex3.appendChild(ex3content);
  pc3.appendChild(ex3);
  
  const ex3b=h("div","roundup-exercise");
  ex3b.appendChild(h("h3",null,"Rewrite the sentences."));
  const ex3bcontent=h("div","exercise-content");
  ex3bcontent.innerHTML = `
    <ol>
      <li>I am late. (always) → I <em>am always late</em>.</li>
      <li>She goes to the theatre on Fridays. (usually)</li>
      <li>Does he visit his grandparents? (sometimes)</li>
      <li>They come to our parties. (often)</li>
      <li>My dad cooks dinner. (never)</li>
      <li>My sister makes her bed. (seldom)</li>
      <li>Do you watch TV in the afternoon? (usually)</li>
      <li>We are rude to people. (never)</li>
    </ol>
  `;
  ex3b.appendChild(ex3bcontent);
  pc3.appendChild(ex3b);
  
  const ex3c=h("div","roundup-exercise");
  ex3c.appendChild(h("h3",null,"Put the verbs into the present simple or the present continuous."));
  const ex3ccontent=h("div","exercise-content");
  ex3ccontent.innerHTML = `
    <p>It 1) <em>is</em> (be) Friday evening and my friends and I 2) <em>are</em> (be) at the disco. Some people 3) <em>are dancing</em> (dance) on the dance floor. Some people 4) <em>are sitting</em> (sit) and 5) <em>are drinking</em> (drink) cola. My friends 6) <em>are talking</em> (talk) and 7) <em>are laughing</em> (laugh) together. We 8) <em>go</em> (go) to the disco every week. We usually 9) <em>drink</em> (drink) cola and 10) <em>dance</em> (dance).</p>
  `;
  ex3c.appendChild(ex3ccontent);
  pc3.appendChild(ex3c);
  content.appendChild(pc3);

  // Progress Check 4
  const pc4=h("section","roundup-section");
  pc4.id="roundup-pc4";
  pc4.appendChild(h("h2",null,"Progress Check 4"));
  const ex4=h("div","roundup-exercise");
  ex4.appendChild(h("h3",null,"Match the sentences to the pictures."));
  const ex4content=h("div","exercise-content");
  ex4content.innerHTML = `
    <ul>
      <li>Don't touch the wall!</li>
      <li>Take your boots off, please!</li>
      <li>Don't shout!</li>
      <li>Go to bed!</li>
      <li>Don't eat those cakes!</li>
      <li>Be careful!</li>
    </ul>
  `;
  ex4.appendChild(ex4content);
  pc4.appendChild(ex4);
  
  const ex4b=h("div","roundup-exercise");
  ex4b.appendChild(h("h3",null,"Complete the text with the words in the list: under, between, behind, on (x2), in"));
  const ex4bcontent=h("div","exercise-content");
  ex4bcontent.innerHTML = `
    <p>The cat is sleeping 1) <em>in</em> its basket 2) <em>under</em> the table.<br>
    Dinner is 3) <em>on</em> the table.<br>
    Peter is sitting 4) <em>between</em> Sally and Grandpa. John is 5) <em>on</em> a chair.<br>
    Grandma is bringing some food 6) <em>on</em> a tray.</p>
  `;
  ex4b.appendChild(ex4bcontent);
  pc4.appendChild(ex4b);
  content.appendChild(pc4);

  // Progress Check 5
  const pc5=h("section","roundup-section");
  pc5.id="roundup-pc5";
  pc5.appendChild(h("h2",null,"Progress Check 5"));
  const ex5=h("div","roundup-exercise");
  ex5.appendChild(h("h3",null,"Look at the pictures. Listen and tick (/) the box. There is one example."));
  const ex5content=h("div","exercise-content");
  ex5content.innerHTML = `
    <p><strong>1</strong> When does Billy have a guitar lesson? B [/]</p>
    <p><strong>2</strong> When is Sara's birthday? C</p>
    <p><strong>3</strong> When do Emma and her sister go to bed? B</p>
  `;
  ex5.appendChild(ex5content);
  pc5.appendChild(ex5);
  
  const ex5b=h("div","roundup-exercise");
  ex5b.appendChild(h("h3",null,"Food items - much / many"));
  const ex5bcontent=h("div","exercise-content");
  ex5bcontent.innerHTML = `
    <p>How many oranges have we got?<br>
    How many biscuits have we got?<br>
    How many apples have we got?<br>
    Can we have a picnic?<br>
    How much chicken have we got?<br>
    How much chocolate have we got?<br>
    How much cola have we got?<br>
    Can we have a picnic?</p>
    <p>We've got chicken and chocolate, too.<br>
    We've got cola for me and you.<br>
    We've got biscuits and apples, too.<br>
    We can have a picnic!</p>
  `;
  ex5b.appendChild(ex5bcontent);
  pc5.appendChild(ex5b);
  content.appendChild(pc5);

  // Progress Check 6
  const pc6=h("section","roundup-section");
  pc6.id="roundup-pc6";
  pc6.appendChild(h("h2",null,"Progress Check 6"));
  const ex6=h("div","roundup-exercise");
  ex6.appendChild(h("h3",null,"Write the sentences. Use be going to and the present continuous."));
  const ex6content=h("div","exercise-content");
  ex6content.innerHTML = `
    <p><strong>1</strong> (eat) → They are going to eat / They are eating<br>
    <strong>2</strong> → [picture exercise - draw lines]</p>
  `;
  ex6.appendChild(ex6content);
  pc6.appendChild(ex6);
  
  const ex6b=h("div","roundup-exercise");
  ex6b.appendChild(h("h3",null,"Look at the pictures. What is Sally going to do next week? Listen and draw lines. There is one example."));
  const ex6bcontent=h("div","exercise-content");
  ex6bcontent.innerHTML = `
    <p>I'm going to see my friends tomorrow<br>
    We're going to go to the park tomorrow<br>
    We're going to play outdoors tomorrow<br>
    We can play all day<br>
    We're going to run and jump tomorrow<br>
    We're going to ride our bikes tomorrow<br>
    We're going to play football tomorrow<br>
    We're going to play tomorrow<br>
    Hip, Hip, Hooray, tomorrow<br>
    We're going to sail our boats tomorrow<br>
    We're going to fly our kites tomorrow<br>
    We're going to eat ice cream tomorrow<br>
    We can play all day</p>
  `;
  ex6b.appendChild(ex6bcontent);
  pc6.appendChild(ex6b);
  content.appendChild(pc6);

  // Progress Check 7
  const pc7=h("section","roundup-section");
  pc7.id="roundup-pc7";
  pc7.appendChild(h("h2",null,"Progress Check 7"));
  const ex7=h("div","roundup-exercise");
  ex7.appendChild(h("h3",null,"Choose the correct item."));
  const ex7content=h("div","exercise-content");
  ex7content.innerHTML = `
    <ol>
      <li>You <strong>must</strong> / mustn't brush your teeth after meals. It's good for your teeth.</li>
      <li>Shall I / Have I make you a cup of coffee?</li>
      <li>You have to / don't have to wear a uniform at our school. You can wear anything you like.</li>
      <li>You must / mustn't swim here. It's dangerous.</li>
      <li>You must / mustn't have a bath. You are so dirty!</li>
      <li>He has to / doesn't have to get up early tomorrow. His flight is at 6:30 in the morning!</li>
      <li>Have / Shall I make you a sandwich?</li>
      <li>Have / May I go out, Miss?</li>
    </ol>
  `;
  ex7.appendChild(ex7content);
  pc7.appendChild(ex7);
  
  const ex7b=h("div","roundup-exercise");
  ex7b.appendChild(h("h3",null,"Write the questions and answers."));
  const ex7bcontent=h("div","exercise-content");
  ex7bcontent.innerHTML = `
    <p><strong>1</strong> Sam / in London / last week?<br>
    Was Sam in London last week?<br>
    No, he wasn't. He was in Madrid.<br><br>
    <strong>3</strong> the girls / at the zoo / yesterday?<br>
    <strong>4</strong> you and your friend / at the cinema / last night?</p>
  `;
  ex7b.appendChild(ex7bcontent);
  pc7.appendChild(ex7b);
  content.appendChild(pc7);

  // Progress Check 8
  const pc8=h("section","roundup-section");
  pc8.id="roundup-pc8";
  pc8.appendChild(h("h2",null,"Progress Check 8"));
  const ex8=h("div","roundup-exercise");
  ex8.appendChild(h("h3",null,"Listen and tick (/) the box. There is one example."));
  const ex8content=h("div","exercise-content");
  ex8content.innerHTML = `
    <p><strong>1</strong> What did Ben have for breakfast?<br>
    <strong>4</strong> What did Ben watch on TV?<br>
    <strong>3</strong> What did Ben have for lunch?</p>
    <p>Oh, we all had lots and lots of fun<br>
    Yes, we all had lots and lots of fun<br>
    We had fun together, fun together<br>
    We had a great day in the sun<br>
    I had breakfast, I had breakfast yesterday<br>
    I played football, I played football yesterday<br>
    I had breakfast, I played football<br>
    My friends and I played football<br>
    He played a game of football yesterday<br>
    I had cola, I had cola yesterday<br>
    I had ice cream, I had ice cream yesterday<br>
    I had cola, I had ice cream<br>
    My friends and I had ice cream<br>
    We all had lots of ice cream yesterday</p>
  `;
  ex8.appendChild(ex8content);
  pc8.appendChild(ex8);
  content.appendChild(pc8);

  // Progress Check 9
  const pc9=h("section","roundup-section");
  pc9.id="roundup-pc9";
  pc9.appendChild(h("h2",null,"Progress Check 9"));
  const ex9=h("div","roundup-exercise");
  ex9.appendChild(h("h3",null,"Complete the text with the past simple form of the verbs in brackets."));
  const ex9content=h("div","exercise-content");
  ex9content.innerHTML = `
    <p>[Past simple exercise - verbs in brackets]</p>
  `;
  ex9.appendChild(ex9content);
  pc9.appendChild(ex9);
  
  const ex9b=h("div","roundup-exercise");
  ex9b.appendChild(h("h3",null,"Read the text again and write the questions for the following answers."));
  const ex9bcontent=h("div","exercise-content");
  ex9bcontent.innerHTML = `
    <p><strong>1</strong> When did you go on a picnic? → Last Sunday.<br>
    <strong>2</strong> Why [did you walk] all the way there? → Because he was tired.<br>
    <strong>3</strong> When [did you have] your lunch? → After our swim.<br>
    <strong>4</strong> When [did you arrive]? → At six o'clock.</p>
  `;
  ex9b.appendChild(ex9bcontent);
  pc9.appendChild(ex9b);
  
  const ex9c=h("div","roundup-exercise");
  ex9c.appendChild(h("h3",null,"Choose the correct item."));
  const ex9ccontent=h("div","exercise-content");
  ex9ccontent.innerHTML = `
    <ol>
      <li>"There's no milk left." → "I <strong>will go</strong> to the supermarket then." A will go B going to go C went</li>
      <li>When [did he come] back from school? A did he come B did he came C did come he</li>
      <li>We've got tickets for the concert. We <strong>are going to see</strong> the band live! A saw B will see C are going to see</li>
      <li>Did you [have] a music lesson yesterday? A has B have C had</li>
      <li>I forgot to feed the cat. I <strong>am going to feed</strong> it now. A fed B will feed C am going to feed</li>
      <li>I've got a cold. I <strong>will make</strong> some hot chocolate. A made B will make C am going to make</li>
      <li>Tina [wrote] this story five years ago. A wrote B will write C is going to write</li>
      <li>"I like your new scarf." → "Really? I <strong>will buy</strong> you one like it then." A will buy B am going to buy C bought</li>
    </ol>
  `;
  ex9c.appendChild(ex9ccontent);
  pc9.appendChild(ex9c);
  content.appendChild(pc9);

  // Progress Check 10
  const pc10=h("section","roundup-section");
  pc10.id="roundup-pc10";
  pc10.appendChild(h("h2",null,"Progress Check 10"));
  const ex10=h("div","roundup-exercise");
  ex10.appendChild(h("h3",null,"Listen and write. There is one example."));
  const ex10content=h("div","exercise-content");
  ex10content.innerHTML = `
    <p><strong>1</strong> When? → on Saturday<br>
    <strong>2</strong> Whose birthday? → ___________________<br>
    <strong>3</strong> Where? → ___________________<br>
    <strong>4</strong> How many people? → ___________________<br>
    <strong>5</strong> What food? → ___________________<br>
    <strong>6</strong> Who took Sally? → ___________________</p>
  `;
  ex10.appendChild(ex10content);
  pc10.appendChild(ex10);
  
  const ex10b=h("div","roundup-exercise");
  ex10b.appendChild(h("h3",null,"Seaside song"));
  const ex10bcontent=h("div","exercise-content");
  ex10bcontent.innerHTML = `
    <p>The sun is shining brightly<br>
    What shall we do today?<br>
    Let's all go to the seaside<br>
    So we can swim and play<br>
    We're happy by the seaside<br>
    We're playing in the sun<br>
    Why don't you come and join us?<br>
    We're having lots of fun<br>
    The water's splashing gently<br>
    We're playing in the sea<br>
    We're swimming and we're sailing</p>
  `;
  ex10b.appendChild(ex10bcontent);
  pc10.appendChild(ex10b);
  content.appendChild(pc10);

  // Progress Check 11
  const pc11=h("section","roundup-section");
  pc11.id="roundup-pc11";
  pc11.appendChild(h("h2",null,"Progress Check 11"));
  const ex11=h("div","roundup-exercise");
  ex11.appendChild(h("h3",null,"Look at the pictures and complete the sentences."));
  const ex11content=h("div","exercise-content");
  ex11content.innerHTML = `
    <ol>
      <li>Zahra is <strong>taller</strong> than Kelly. (tall)</li>
      <li>It is <strong>colder</strong> in Finland than in England. (cold)</li>
      <li>John is <strong>younger</strong> than his brother Peter. (young)</li>
      <li>The brown sweater is <strong>more expensive</strong> than the blue one. (expensive)</li>
      <li>Buddy is <strong>thinner</strong> than Blackie. (thin)</li>
      <li>The pink rabbit is <strong>hungrier</strong> than the yellow one. (hungry)</li>
      <li>My sandwich is <strong>bigger</strong> than yours. (big)</li>
      <li>The Glamour Hotel is <strong>more modern</strong> than the Grand Hotel. (modern)</li>
    </ol>
  `;
  ex11.appendChild(ex11content);
  pc11.appendChild(ex11);
  
  const ex11b=h("div","roundup-exercise");
  ex11b.appendChild(h("h3",null,"Complete the text with and, or, but, because."));
  const ex11bcontent=h("div","exercise-content");
  ex11bcontent.innerHTML = `
    <p>Dear Sue,<br>
    Greetings from sunny Spain. It's very hot <strong>and</strong> sunny here. The hotel is excellent <strong>but</strong> it's very small. There are only ten rooms. The people here are very kind <strong>and</strong> friendly. Guess what! I met a girl. Her name is Carla. She is from Brazil <strong>or</strong> Argentina. I'm not sure.<br>
    I want to buy Mum a hat <strong>or</strong> a T-shirt. Which one do you think she'll like more?<br>
    Oh yes, I almost forgot. I want to send Frank an email <strong>but</strong> I lost his email address.<br>
    Can you send it to me, please?<br>
    I have to run now <strong>because</strong> I am going to meet Carla in five minutes <strong>and</strong> I don't want to be late.<br>
    Talk to you soon.<br>
    Bob</p>
  `;
  ex11b.appendChild(ex11bcontent);
  pc11.appendChild(ex11b);
  
  const ex11c=h("div","roundup-exercise");
  ex11c.appendChild(h("h3",null,"Write sentences as in the example."));
  const ex11ccontent=h("div","exercise-content");
  ex11ccontent.innerHTML = `
    <p><strong>1</strong> the Sahara Desert / be / dry place / in Africa → The Sahara Desert is the driest place in Africa.<br>
    <strong>2</strong> Mount Everest / be / high mountain / in world<br>
    <strong>3</strong> the Nile / be / long river / in world<br>
    <strong>4</strong> Judy / be / pretty girl / I know<br>
    <strong>5</strong> Athens / be / big city / in Greece<br>
    <strong>6</strong> George / be / careful drive / I know</p>
  `;
  ex11c.appendChild(ex11ccontent);
  pc11.appendChild(ex11c);
  content.appendChild(pc11);

  // Gap tuzish / Sentence Building
  const sb=h("section","roundup-section");
  sb.id="roundup-sentence-building";
  sb.appendChild(h("h2",null,"Gap tuzish / Sentence Building"));
  const sbcontent=h("div","exercise-content");
  sbcontent.innerHTML = `
    <h3>Oddiy gaplar (Simple Sentences)</h3>
    <p>Oddiy gap bitta egasi va bitta fe'l bilan quriladi: <strong>Subject + Verb (+ Object)</strong>.</p>
    <ul>
      <li><strong>The cat sits</strong> on the mat. — Mushuk halqada otiradi.</li>
      <li><strong>She reads books.</strong> — U kitoblarni o'qaydi.</li>
      <li><strong>They play football.</strong> — Ular futbol o'ynaydi.</li>
      <li><strong>I am a student.</strong> — Men talabaman.</li>
      <li><strong>He drinks water.</strong> — U suv ichadi.</li>
    </ul>

    <h3>Murakkab gaplar (Compound Sentences)</h3>
    <p>Murakkab gap ikki yoki undan ortiq oddiy gapni bog'lovchi so'z (<strong>and, but, or, so</strong>) bilan birlashtiradi.</p>
    <ul>
      <li><strong>I like tea, and she likes coffee.</strong> — Men choyni sevaman, va u qahvani sevadi.</li>
      <li><strong>He was tired, but he continued working.</strong> — U yorqan edi, ammo ishlashni davom ettirdi.</li>
      <li><strong>Do you want tea or coffee?</strong> — Siz choymi yoki qahvami istaysiz?</li>
      <li><strong>It was raining, so we stayed at home.</strong> — Yomg'ir yurgan edi, shuning uchun biz uyda qoldiq.</li>
      <li><strong>She sang, and he danced.</strong> — U seniydi, va u raqs etdi.</li>
    </ul>

    <h3>Murakkab-murakkab gaplar (Complex Sentences)</h3>
    <p>Ushbu gap birorta asosiy gap va birorta yoki undan ortiq kelib chiqadigan gapdan (<strong>although, because, when, if</strong>) iborat bo'ladi.</p>
    <ul>
      <li><strong>Although it was raining, we went for a walk.</strong> — Yomg'ir yurgan ekanligiga qaramay, biz sargarda yuradiq.</li>
      <li><strong>Because she studied hard, she passed the exam.</strong> — U qat'iyroq o'qiganligi uchun imtihondan o'tdi.</li>
      <li><strong>When I arrive, I will call you.</strong> — Men kelganda, sizga telefon qilaman.</li>
      <li><strong>If you study, you will succeed.</strong> — Agar siz o'qsangiz, muvaffaqiyatga erishasiz.</li>
      <li><strong>I will help you if you ask me.</strong> — Agar siz menga so'rsangiz, men sizga yordam beraman.</li>
    </ul>
  `;
  sb.appendChild(sbcontent);
  content.appendChild(sb);

  // Revision 1 (Units 1-2)
  const rev1=h("section","roundup-section");
  rev1.id="roundup-rev1";
  rev1.appendChild(h("h2",null,"Revision 1 (Units 1-2)"));
  content.appendChild(rev1);

  // Revision 2 (Units 1-4)
  const rev2=h("section","roundup-section");
  rev2.id="roundup-rev2";
  rev2.appendChild(h("h2",null,"Revision 2 (Units 1-4)"));
  content.appendChild(rev2);

  // Revision 3 (Units 1-6)
  const rev3=h("section","roundup-section");
  rev3.id="roundup-rev3";
  rev3.appendChild(h("h2",null,"Revision 3 (Units 1-6)"));
  content.appendChild(rev3);

  // Revision 4 (Units 1-8)
  const rev4=h("section","roundup-section");
  rev4.id="roundup-rev4";
  rev4.appendChild(h("h2",null,"Revision 4 (Units 1-8)"));
  content.appendChild(rev4);

  // Revision 5 (Units 1-10)
  const rev5=h("section","roundup-section");
  rev5.id="roundup-rev5";
  rev5.appendChild(h("h2",null,"Revision 5 (Units 1-10)"));
  content.appendChild(rev5);

  // Revision 6 (Units 1-12)
  const rev6=h("section","roundup-section");
  rev6.id="roundup-rev6";
  rev6.appendChild(h("h2",null,"Revision 6 (Units 1-12)"));
  content.appendChild(rev6);

  // Revision 7 (Units 1-14)
  const rev7=h("section","roundup-section");
  rev7.id="roundup-rev7";
  rev7.appendChild(h("h2",null,"Revision 7 (Units 1-14)"));
  content.appendChild(rev7);

  // Revision 8 (Units 1-16)
  const rev8=h("section","roundup-section");
  rev8.id="roundup-rev8";
  rev8.appendChild(h("h2",null,"Revision 8 (Units 1-16)"));
  content.appendChild(rev8);

  // Revision 9 (Units 1-18)
  const rev9=h("section","roundup-section");
  rev9.id="roundup-rev9";
  rev9.appendChild(h("h2",null,"Revision 9 (Units 1-18)"));
  content.appendChild(rev9);

  // Revision 10 (Units 1-20)
  const rev10=h("section","roundup-section");
  rev10.id="roundup-rev10";
  rev10.appendChild(h("h2",null,"Revision 10 (Units 1-20)"));
  content.appendChild(rev10);

  // Revision 11 (Units 1-22)
  const rev11=h("section","roundup-section");
  rev11.id="roundup-rev11";
  rev11.appendChild(h("h2",null,"Revision 11 (Units 1-22)"));
  content.appendChild(rev11);

  card.appendChild(content);
  b.appendChild(card);
}
function shuffle(items){
  const shuffled=items.slice();
  for(let index=shuffled.length-1;index>0;index--){
    const other=Math.floor(Math.random()*(index+1));
    [shuffled[index],shuffled[other]]=[shuffled[other],shuffled[index]];
  }
  return shuffled;
}
function rBaamboozle(b,l){
  const copy=PRACTICE_COPY[LANG];
  const st=state[l.n]||(state[l.n]={lv:0,sel:{},inp:{},done:{}});
  const questions=practiceQuestions(l);
  const card=h("div","card");
  card.appendChild(h("h3",null,"🎲 "+copy.baamTitle));
  card.appendChild(h("p","tip",copy.baamTip));
  if(!st.game){
    const setup=h("div","game-setup");
    setup.appendChild(h("span",null,copy.teamCount+":"));
    const count=h("select");
    [2,3,4].forEach(value=>{const option=h("option",null,String(value));option.value=String(value);count.appendChild(option);});
    setup.appendChild(count);
    const teamInputs=h("div","game-setup");
    const names=[];
    [1,2,3,4].forEach(index=>{
      const input=h("input","team-name");input.placeholder=copy.team+" "+index;
      input.value=copy.team+" "+index;input.dataset.teamNumber=String(index);
      names.push(input);teamInputs.appendChild(input);
    });
    count.onchange=()=>names.forEach((input,index)=>{input.hidden=index>=Number(count.value);});
    count.onchange();
    setup.appendChild(teamInputs);
    const start=h("button","btn",copy.start);
    start.onclick=()=>{
      const teamCount=Number(count.value);
      const tiles=shuffle(Array.from({length:24},(_,index)=>({question:questions[index%questions.length],points:[5,10,15,20,25][index%5],effect:["normal","normal","bonus","double","steal","risk"][index%6],used:false})));
      st.game={teams:Array.from({length:teamCount},(_,index)=>({name:names[index].value.trim()||copy.team+" "+(index+1),score:0})),tiles,turn:0,currentTile:null,remaining:20,resolved:false};
      render();
    };
    setup.appendChild(start);card.appendChild(setup);b.appendChild(card);return;
  }
  const game=st.game;
  const scores=h("table","game-teams");
  const scoreHead=h("tr",null,null,[h("th",null,copy.team),h("th",null,copy.score)]);scores.appendChild(scoreHead);
  game.teams.forEach((team,index)=>{
    const row=h("tr",index===game.turn%game.teams.length?"active":"");
    row.appendChild(h("td",null,team.name));row.appendChild(h("td",null,String(team.score)));scores.appendChild(row);
  });
  const board=h("div","game-layout");
  const questionBox=h("div","game-question");
  const available=game.tiles.filter(tile=>!tile.used);
  if(available.length===0&&!game.currentTile){
    questionBox.appendChild(h("h3",null,copy.finished));
    const winner=game.teams.slice().sort((first,second)=>second.score-first.score)[0];
    questionBox.appendChild(h("div","game-answer",copy.winner+": "+winner.name+" · "+winner.score));
    const boardFinished=h("div","game-tiles");
    boardFinished.appendChild(questionBox);board.appendChild(boardFinished);
  }else{
    const tiles=h("div","game-tiles");
    game.tiles.forEach((tile,index)=>{
      const button=h("button","game-tile "+tile.effect,String(index+1));
      button.disabled=tile.used||!!game.currentTile;
      button.title=tile.used?copy.used:copy.chooseTile+" · "+tile.points+" "+copy.points;
      button.onclick=()=>{tile.used=true;game.currentTile=tile;game.remaining=20;game.resolved=false;game.locked=false;render();};
      tiles.appendChild(button);
    });
    board.appendChild(tiles);
    if(game.currentTile){
      const tile=game.currentTile,question=tile.question;
      const side=h("div","game-side");
      side.appendChild(h("div","game-turn",copy.turn+": "+game.teams[game.turn%game.teams.length].name));
      side.appendChild(h("div","game-timer",String(game.remaining)));
      side.appendChild(h("div","game-effect",copy.effects[tile.effect]+" · "+tile.points+" "+copy.points));
      questionBox.appendChild(h("h3",null,question.q));
      if(game.resolved){
        questionBox.appendChild(h("div","game-answer",copy.right+": "+question.o[question.a]));
        const next=h("button","btn",copy.next);
        next.onclick=()=>{game.currentTile=null;game.turn++;render();};
        questionBox.appendChild(next);
      }else{
        const choices=h("div","opts");
        question.o.forEach((option,index)=>{
          const button=h("button","opt",String.fromCharCode(65+index)+") "+option);
          button.disabled=game.locked;
          button.onclick=()=>{
            if(game.resolved||game.locked)return;
            game.locked=true;
            const active=game.teams[game.turn%game.teams.length];
            if(index===question.a){
              if(tile.effect==="bonus")active.score+=tile.points+10;
              else if(tile.effect==="steal"){
                const leader=game.teams.reduce((best,team)=>team.score>best.score?team:best,game.teams[0]);
                if(leader!==active&&leader.score>0){const stolen=Math.min(tile.points,leader.score);leader.score-=stolen;active.score+=stolen;}
                else active.score+=tile.points;
              }else active.score+=tile.points*(tile.effect==="double"?2:1);
            }else if(tile.effect==="risk")active.score-=tile.points;
            game.resolved=true;render();
          };
          choices.appendChild(button);
        });
        questionBox.appendChild(choices);
        questionBox.appendChild(h("p","tip",copy.timerTip));
        baamTimer=setInterval(()=>{
          if(!state[l.n]||state[l.n].game!==game)return;
          if(game.remaining>0){game.remaining--;const timer=document.querySelector(".game-timer");if(timer)timer.textContent=String(game.remaining);}
          else{game.locked=true;game.resolved=true;render();}
        },1000);
      }
      side.appendChild(questionBox);board.appendChild(side);
    }
  }
  board.appendChild(scores);card.appendChild(board);
  const reset=h("button","btn alt",copy.newGame);reset.onclick=()=>{st.game=null;render();};
  card.appendChild(h("div","actions",null,[reset]));b.appendChild(card);
}
function lessonVocabulary(l){
  const terms=l.title.toLowerCase().split(/[^a-z]+/).filter(word=>word.length>2);
  const candidates=D.lessons.slice().sort((first,second)=>{
    const score=lesson=>lesson.title.toLowerCase().split(/[^a-z]+/).filter(word=>word.length>2&&terms.includes(word)).length;
    return score(second)-score(first);
  });
  const words=[],seen=new Set();
  candidates.forEach(lesson=>(lesson.pics||[]).forEach(pic=>{
    const key=(pic[1]||"").toLowerCase().trim();
    if(key&&!seen.has(key)){seen.add(key);words.push(pic);}
  }));
  if(words.length<30){
    D.lessons.forEach(lesson=>(lesson.pics||[]).forEach(pic=>{
      const key=(pic[1]||"").toLowerCase().trim();
      if(key&&!seen.has(key)){seen.add(key);words.push(pic);}
    }));
  }
  return words.slice(0,30);
}
function rVocab(b,l){
  const copy=PRACTICE_COPY[LANG];
  const st=state[l.n]||(state[l.n]={lv:0,sel:{},inp:{},done:{}});
  const shown=st.vocabShown||(st.vocabShown=new Set());
  const words=lessonVocabulary(l);
  const card=h("div","card");
  card.appendChild(h("h3",null,"📚 "+copy.vocabTitle));
  card.appendChild(h("p","tip",copy.vocabTip));
  const toolbar=h("div","practice-toolbar");
  const revealAll=h("button","btn alt",shown.size===words.length?copy.allHide:copy.allReveal);
  revealAll.onclick=()=>{if(shown.size===words.length)shown.clear();else words.forEach((_,index)=>shown.add(index));render();};
  toolbar.appendChild(revealAll);card.appendChild(toolbar);
  const table=h("table","vocab-table");
  table.appendChild(h("thead",null,null,[h("tr",null,null,[h("th",null,"English"),h("th",null,copy.translation),h("th",null,"")])]));
  const rows=h("tbody");
  words.forEach((word,index)=>{
    const row=h("tr");
    row.appendChild(h("td","vocab-word",(word[0]?word[0]+" ":"")+word[1]));
    row.appendChild(h("td","vocab-translation",shown.has(index)?(word[2]||""):"••••••"));
    const action=h("td"),button=h("button",null,shown.has(index)?copy.hide:copy.reveal);
    button.onclick=()=>{if(shown.has(index))shown.delete(index);else shown.add(index);render();};
    action.appendChild(button);row.appendChild(action);rows.appendChild(row);
  });
  table.appendChild(rows);card.appendChild(table);b.appendChild(card);
}
function rSay(b,l){
  const card=h("div","card"); card.appendChild(h("h3",null,"🗣️ "+UI.say_h));
  l.say.forEach((s,i)=>card.appendChild(h("div","say-it",null,[h("span","step",String(i+1)),h("div","ex",null,[h("span","en",s[0]),h("span","loc",s[1]||"")])])));
  b.appendChild(card);
}
function rHw(b,l){
  const card=h("div","card"); card.appendChild(h("h3",null,"🏠 "+UI.hw_h)); card.appendChild(h("p","tip",UI.tip_hw));
  const ol=h("ol","hw");
  l.hw.forEach(t=>{const isRev=/^\d+-/.test(t);ol.appendChild(h("li",isRev?"rev":"",t));});
  card.appendChild(ol); b.appendChild(card);
}
function rReview(b,l){
  const card=h("div","card"); card.appendChild(h("h3",null,"🔁 "+UI.review_h));
  card.appendChild(h("p","tip",UI.answers_note?"":""));
  if(l.review){
    l.review.forEach(r=>{
      const sec=h("div","rv"); sec.appendChild(h("h4",null,r.n+". "+r.title+" — "+r.loc));
      sec.appendChild(fboxes(r.formula.slice(0,4)));
      r.ex.slice(0,2).forEach(e=>sec.appendChild(h("div","ex",null,[h("span","en",e[0]),h("span","loc",e.slice(1).join(" · "))])));
      card.appendChild(sec);
    });
  } else {
    card.appendChild(h("p",null,UI.test+" "+l.range[0]+"–"+l.range[1]));
  }
  b.appendChild(card);
}
function setTrBtn(){document.getElementById("trBtn").textContent="🌐 "+(showTr?UI.hide_tr:UI.show_tr);}
function applyLang(){
  document.documentElement.lang=UI.html_lang;
  document.title="English Course · "+LANG.toUpperCase();
  const t=document.getElementById("ttl"); t.textContent="";
  t.appendChild(document.createTextNode("📘 "+UI.course));
  t.appendChild(h("small",null,UI.lang_name+" · "+UI.course_sub));
  document.getElementById("menuBtn").textContent="☰ "+UI.menu;
  document.getElementById("fsSeg").title=UI.present;
  document.querySelectorAll("#langSeg button").forEach(b=>b.classList.toggle("on",b.dataset.l===LANG));
  setTrBtn();
}
function setLang(l){
  if(!ALL[l]||l===LANG) return;
  LANG=l; LS.set("lang",l); D=ALL[l]; UI=D.ui;
  for(const k in state) delete state[k];
  applyLang(); buildNav(); render();
}
document.querySelectorAll("#langSeg button").forEach(b=>b.onclick=()=>setLang(b.dataset.l));
document.getElementById("trBtn").onclick=()=>{showTr=!showTr;LS.set("tr",showTr?"1":"0");setTrBtn();render();};
function setFs(s){
  if(!["1","2","3","4","5"].includes(s)) s="3";
  document.body.dataset.fs=s; LS.set("fs",s);
  document.querySelectorAll("#fsSeg button").forEach(b=>b.classList.toggle("on",b.dataset.s===s));
}
document.querySelectorAll("#fsSeg button").forEach(b=>b.onclick=()=>setFs(b.dataset.s));
setFs(LS.get("fs")||"3");
const isDesk=()=>matchMedia("(min-width:861px)").matches;
function closeNav(){ if(isDesk()){document.body.classList.add("nav-closed");LS.set("navClosed","1");} else document.getElementById("nav").classList.remove("open"); }
function openNav(){
  if(isDesk()){document.body.classList.remove("nav-closed");LS.set("navClosed","0");}
  else{const nav=document.getElementById("nav");nav.style.top=document.querySelector(".top").getBoundingClientRect().height+"px";nav.classList.add("open");}
}
if(LS.get("navClosed")==="1"||/closed/.test(location.hash)) document.body.classList.add("nav-closed");
document.getElementById("openNav").onclick=openNav;
document.getElementById("menuBtn").onclick=()=>{
  const nav=document.getElementById("nav");
  if(nav.classList.contains("open")) nav.classList.remove("open"); else openNav();
};
window.addEventListener("resize",()=>{
  const nav=document.getElementById("nav");
  if(nav.classList.contains("open")&&!isDesk()) nav.style.top=document.querySelector(".top").getBoundingClientRect().height+"px";
});
document.getElementById("themeBtn").onclick=()=>{const r=document.documentElement;const d=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=d?"light":"dark";};
const annotation=document.getElementById("annotation");
const annotationCanvas=document.getElementById("annotationCanvas");
const annotationContext=annotationCanvas.getContext("2d");
let annotationActive=false, annotationDrawing=false, annotationInk="#dc2626", annotationWidth=7, annotationErase=false, previousOverflow="";
function resizeAnnotationCanvas(){
  const saved=document.createElement("canvas");
  saved.width=annotationCanvas.width; saved.height=annotationCanvas.height;
  if(saved.width&&saved.height) saved.getContext("2d").drawImage(annotationCanvas,0,0);
  const ratio=window.devicePixelRatio||1;
  annotationCanvas.width=Math.round(window.innerWidth*ratio);
  annotationCanvas.height=Math.round(window.innerHeight*ratio);
  annotationContext.setTransform(ratio,0,0,ratio,0,0);
  if(saved.width&&saved.height) annotationContext.drawImage(saved,0,0,saved.width,saved.height,0,0,window.innerWidth,window.innerHeight);
}
function closeAnnotation(){
  annotationActive=false; annotation.classList.remove("open"); document.body.classList.remove("annotation-mode");
  document.body.style.overflow=previousOverflow; document.getElementById("annotateLaunch").focus();
}
document.getElementById("annotateLaunch").onclick=()=>{
  if(annotationActive) return;
  previousOverflow=document.body.style.overflow; annotationActive=true;
  annotation.classList.add("open"); document.body.classList.add("annotation-mode"); resizeAnnotationCanvas();
};
window.addEventListener("resize",()=>{if(annotationActive) resizeAnnotationCanvas();});
annotationCanvas.addEventListener("pointerdown",e=>{
  annotationDrawing=true; annotationCanvas.setPointerCapture(e.pointerId);
  const rect=annotationCanvas.getBoundingClientRect();
  annotationContext.beginPath(); annotationContext.moveTo(e.clientX-rect.left,e.clientY-rect.top);
  annotationContext.strokeStyle=annotationErase?"rgba(0,0,0,1)":annotationInk;
  annotationContext.globalCompositeOperation=annotationErase?"destination-out":"source-over";
  annotationContext.lineWidth=annotationErase?24:annotationWidth; annotationContext.lineCap="round"; annotationContext.lineJoin="round";
  annotationContext.lineTo(e.clientX-rect.left+0.1,e.clientY-rect.top+0.1); annotationContext.stroke();
});
annotationCanvas.addEventListener("pointermove",e=>{
  if(!annotationDrawing) return;
  const rect=annotationCanvas.getBoundingClientRect();
  annotationContext.lineTo(e.clientX-rect.left,e.clientY-rect.top); annotationContext.stroke();
});
function stopAnnotationStroke(){annotationDrawing=false;}
annotationCanvas.addEventListener("pointerup",stopAnnotationStroke);
annotationCanvas.addEventListener("pointercancel",stopAnnotationStroke);
document.querySelectorAll(".annotation-tools [data-ink]").forEach(button=>button.onclick=()=>{
  annotationInk=button.dataset.ink; annotationErase=false;
  document.querySelectorAll(".annotation-tools [data-ink]").forEach(item=>item.classList.toggle("active",item===button));
  document.getElementById("annotationEraser").classList.remove("active");
});
document.querySelectorAll(".annotation-tools [data-width]").forEach(button=>button.onclick=()=>{
  annotationWidth=Number(button.dataset.width); annotationErase=false;
  document.querySelectorAll(".annotation-tools [data-width]").forEach(item=>item.classList.toggle("active",item===button));
  document.getElementById("annotationEraser").classList.remove("active");
});
document.getElementById("annotationEraser").onclick=e=>{
  annotationErase=!annotationErase; e.currentTarget.classList.toggle("active",annotationErase);
  document.querySelectorAll(".annotation-tools [data-ink]").forEach(button=>button.classList.toggle("active",!annotationErase&&button.dataset.ink===annotationInk));
};
document.getElementById("annotationClear").onclick=()=>annotationContext.clearRect(0,0,window.innerWidth,window.innerHeight);
document.getElementById("annotationClose").onclick=closeAnnotation;
const whiteboard=document.getElementById("whiteboard");
const whiteboardCanvas=document.getElementById("whiteboardCanvas");
const whiteboardContext=whiteboardCanvas.getContext("2d");
let whiteboardActive=false,whiteboardDrawing=false,whiteboardColor="#172033",whiteboardWidth=6,whiteboardErase=false,whiteboardPreviousOverflow="";
let whiteboardStrokes=[],whiteboardStroke=null;
let boardTool="pen",boardItems=[],boardDragging=null,boardDragOff=[0,0];
const boardEditor=document.getElementById("boardEditor");
const BUI={uz:{text:"Matn",formula:"Formula",titleText:"Matn kartochkasi",titleFormula:"Formula kartochkasi",labelEn:"Asl matn (Ingliz tili)",labelTr:"Tarjima matn",labelLatex:"LaTeX formula",save:"Saqlash",cancel:"Bekor qilish",delete:"O'chirish",edit:"Tahrir"},ru:{text:"Текст",formula:"Формула",titleText:"Карточка текста",titleFormula:"Карточка формулы",labelEn:"Оригинальный текст (английский)",labelTr:"Перевод",labelLatex:"LaTeX формула",save:"Сохранить",cancel:"Отмена",delete:"Удалить",edit:"Править"}};
function esc(t){return String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function redrawWhiteboard(){
  const ratio=window.devicePixelRatio||1;
  whiteboardCanvas.width=Math.round(window.innerWidth*ratio);
  whiteboardCanvas.height=Math.round(window.innerHeight*ratio);
  whiteboardContext.setTransform(ratio,0,0,ratio,0,0);
  whiteboardContext.fillStyle="#fff";whiteboardContext.fillRect(0,0,window.innerWidth,window.innerHeight);
  whiteboardStrokes.forEach(stroke=>{
    if(stroke.points.length<2)return;
    whiteboardContext.beginPath();whiteboardContext.moveTo(stroke.points[0][0],stroke.points[0][1]);
    stroke.points.slice(1).forEach(point=>whiteboardContext.lineTo(point[0],point[1]));
    whiteboardContext.globalCompositeOperation=stroke.erase?"destination-out":"source-over";
    whiteboardContext.strokeStyle=stroke.color;whiteboardContext.lineWidth=stroke.width;
    whiteboardContext.lineCap="round";whiteboardContext.lineJoin="round";whiteboardContext.stroke();
  });
  whiteboardContext.globalCompositeOperation="source-over";
  renderBoardItems();
}
function ensureBoardLayer(){let layer=document.getElementById("boardLayer");if(!layer){layer=document.createElement("div");layer.id="boardLayer";layer.className="board-layer";whiteboard.appendChild(layer);}return layer;}
function renderBoardItems(){const layer=ensureBoardLayer();layer.innerHTML="";boardItems.forEach(it=>{layer.appendChild(buildBoardItemEl(it));});}
function buildBoardItemEl(it){
  const el=document.createElement("div");el.className="board-item "+(it.type==="formula"?"formula-card":"text-card");
  el.style.left=it.x+"px";el.style.top=it.y+"px";el.dataset.id=it.id;
  const actions=document.createElement("div");actions.className="b-actions";
  actions.innerHTML='<button class="b-act" title="Tahrir" aria-label="Tahrir">✎</button><button class="b-act" title="O\'chirish" aria-label="O\'chirish">×</button>';
  el.appendChild(actions);
  if(it.type==="text"){
    el.appendChild(Object.assign(document.createElement("div"),{className:"b-title",textContent:BUI[LANG].titleText}));
    const en=document.createElement("div");en.className="b-text";en.textContent=it.textEn;el.appendChild(en);
    const tr=document.createElement("div");tr.className="b-tr";tr.textContent=it.textTr?("— "+it.textTr):"";el.appendChild(tr);
  }else{
    el.appendChild(Object.assign(document.createElement("div"),{className:"b-title",textContent:BUI[LANG].titleFormula}));
    const kd=document.createElement("div");kd.className="katex";try{katex.render(it.latex||"",kd,{throwOnError:false});}catch(e){kd.textContent=it.latex;}el.appendChild(kd);
  }
  el.onpointerdown=ev=>{ev.stopPropagation();startDrag(el,ev);};
  el.ondblclick=ev=>{ev.stopPropagation();openBoardEditor(it);};
  el.querySelectorAll(".b-act").forEach((b,i)=>{b.onclick=ev=>{ev.stopPropagation();i===0?openBoardEditor(it):deleteBoardItem(it.id);};});
  return el;
}
function deleteBoardItem(id){boardItems=boardItems.filter(x=>x.id!==id);renderBoardItems();}
function openBoardEditor(it){
  const en=document.getElementById("boardEditorEn"),tr=document.getElementById("boardEditorTr"),lx=document.getElementById("boardEditorLatex"),pr=document.getElementById("boardEditorPreview");
  const title=document.getElementById("boardEditorTitle"),le=document.getElementById("boardEditorLabelEn"),lt=document.getElementById("boardEditorLabelTr"),ll=document.getElementById("boardEditorLabelLatex");
  boardEditor.currentItem=it;en.value=it.textEn||"";tr.value=it.textTr||"";lx.value=it.latex||"";pr.textContent="";
  if(it.type==="text"){title.textContent=BUI[LANG].titleText;le.textContent=BUI[LANG].labelEn;lt.textContent=BUI[LANG].labelTr;en.style.display="block";tr.style.display="block";le.style.display="block";lt.style.display="block";lx.style.display="none";ll.style.display="none";}else{title.textContent=BUI[LANG].titleFormula;ll.textContent=BUI[LANG].labelLatex;lx.style.display="block";ll.style.display="block";en.style.display="none";tr.style.display="none";le.style.display="none";lt.style.display="none";renderLatexPreview();}
  boardEditor.classList.add("open");boardEditor.setAttribute("aria-hidden","false");en.focus();
}
function renderLatexPreview(){const lx=document.getElementById("boardEditorLatex"),pr=document.getElementById("boardEditorPreview");pr.textContent="";try{katex.render(lx.value||"",pr,{throwOnError:false});}catch(e){pr.textContent="LaTeX xato: "+e.message;}}
function startDrag(el,ev){if(ev.target.closest(".b-act"))return;boardDragging=el;const it=boardItems.find(x=>x.id===el.dataset.id);if(!it)return;const rect=whiteboardCanvas.getBoundingClientRect();boardDragOff=[ev.clientX-rect.left-it.x,ev.clientY-rect.top-it.y];whiteboardCanvas.setPointerCapture(ev.pointerId);}
function escHtml(t){return String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function printWhiteboard(){
  const ratio=window.devicePixelRatio||1;
  const w=Math.round(window.innerWidth*ratio);
  const h=Math.round(window.innerHeight*ratio);
  const dataUrl=whiteboardCanvas.toDataURL("image/png");
  let itemsHtml="";
  boardItems.forEach(it=>{
    const style=`left:${it.x}px;top:${it.y}px;`;
    if(it.type==="text"){
      itemsHtml+=`<div class="p-item text-card" style="${style}"><div class="p-title">${escHtml(BUI[LANG].titleText)}</div><div class="p-text">${escHtml(it.textEn)}</div>${it.textTr?`<div class="p-tr">— ${escHtml(it.textTr)}</div>`:""}</div>`;
    }else{
      itemsHtml+=`<div class="p-item formula-card" style="${style}"><div class="p-title">${escHtml(BUI[LANG].titleFormula)}</div><div class="p-katex">\\(${escHtml(it.latex)}\\)</div></div>`;
    }
  });
  const win=window.open("","_blank");
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Doska — chop etish</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
:root{--bg:#f4f6fb;--card:#ffffff;--ink:#1d2433;--muted:#667089;--line:#e3e8f2;--brand:#5b5bf0;--brand2:#8b5cf6;--shadow:0 6px 24px rgba(40,50,100,.10);--font-ui:"Inter",system-ui,-apple-system,"Noto Sans",Arial,sans-serif;--font-display:"Poppins",system-ui,-apple-system,"Noto Sans",Arial,sans-serif;}
body{margin:0;background:#fff;font-family:var(--font-ui)}
.p-page{position:relative;width:${w/ratio}px;height:${h/ratio}px;background:url('${dataUrl}') no-repeat;background-size:cover;overflow:hidden}
.p-item{position:absolute;pointer-events:none;user-select:none;white-space:pre-wrap;line-height:1.4;word-wrap:break-word;box-sizing:border-box}
.p-item.text-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 16px;min-width:170px;box-shadow:var(--shadow)}
.p-item.formula-card{background:#1f2438;color:#eef1ff;border:1.5px dashed var(--brand2);border-radius:14px;padding:14px 18px;min-width:170px;box-shadow:var(--shadow)}
.p-item .p-title{display:block;font:700 .72rem var(--font-display);color:var(--muted);margin-bottom:6px;letter-spacing:.05em;text-transform:uppercase}
.p-item .p-text{font:600 1.05rem var(--font-ui);color:var(--ink)}
.p-item .p-tr{margin-top:6px;display:block;font:500 .95rem var(--font-ui);color:var(--muted)}
.p-item .p-katex{font-size:1.35rem;margin-top:6px}
@media print{body{background:#fff} .p-page{background-size:contain}}
</style>
</head><body><div class="p-page">${itemsHtml}</div>
<script>
try{renderMathInElement(document.body,{delimiters:[{type:"math",start:"\\\\(",end:"\\\\)",display:false}]});}catch(e){}
window.onload=()=>{setTimeout(()=>{try{window.print();}catch(e){}},400);};
<\/script>
</body></html>`);
  win.document.close();
}
function closeWhiteboard(){
  whiteboardActive=false;whiteboard.classList.remove("open");whiteboard.setAttribute("aria-hidden","true");
  document.body.classList.remove("board-mode");document.body.style.overflow=whiteboardPreviousOverflow;
  const launcher=document.querySelector(".board-open");if(launcher)launcher.focus();
}
function openWhiteboard(){
  if(whiteboardActive)return;
  whiteboardPreviousOverflow=document.body.style.overflow;whiteboardActive=true;
  whiteboard.classList.add("open");whiteboard.setAttribute("aria-hidden","false");document.body.classList.add("board-mode");
  redrawWhiteboard();renderBoardItems();
}
window.addEventListener("resize",()=>{if(whiteboardActive)redrawWhiteboard();});
whiteboardCanvas.addEventListener("pointerdown",event=>{
  const item=event.target.closest(".board-item");
  if(item){startDrag(item,event);return;}
  if(boardTool==="text"||boardTool==="formula"){
    const rect=whiteboardCanvas.getBoundingClientRect();
    const id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
    boardItems.push({id,type:boardTool,x:event.clientX-rect.left,y:event.clientY-rect.top,textEn:"",textTr:"",latex:""});
    renderBoardItems();openBoardEditor(boardItems[boardItems.length-1]);return;
  }
  whiteboardDrawing=true;whiteboardCanvas.setPointerCapture(event.pointerId);
  const rect=whiteboardCanvas.getBoundingClientRect();
  whiteboardStroke={color:whiteboardColor,width:whiteboardErase?26:whiteboardWidth,erase:whiteboardErase,points:[[event.clientX-rect.left,event.clientY-rect.top]]};
  whiteboardStrokes.push(whiteboardStroke);
});
whiteboardCanvas.addEventListener("pointermove",event=>{
  if(boardDragging){
    const it=boardItems.find(x=>x.id===boardDragging.dataset.id);const rect=whiteboardCanvas.getBoundingClientRect();
    if(it){it.x=event.clientX-rect.left-boardDragOff[0];it.y=event.clientY-rect.top-boardDragOff[1];boardDragging.style.left=it.x+"px";boardDragging.style.top=it.y+"px";}
    return;
  }
  if(!whiteboardDrawing||!whiteboardStroke)return;
  const rect=whiteboardCanvas.getBoundingClientRect();
  whiteboardStroke.points.push([event.clientX-rect.left,event.clientY-rect.top]);redrawWhiteboard();
});
function endPointer(){if(boardDragging){boardDragging=null;return;}whiteboardDrawing=false;whiteboardStroke=null;}
whiteboardCanvas.addEventListener("pointerup",endPointer);
whiteboardCanvas.addEventListener("pointercancel",endPointer);
document.getElementById("boardToolText").onclick=ev=>{setBoardTool("text",ev.currentTarget);};
document.getElementById("boardToolFormula").onclick=ev=>{setBoardTool("formula",ev.currentTarget);};
function setBoardTool(tool,btn){boardTool=tool;whiteboardErase=false;document.querySelectorAll(".board-tool").forEach(b=>b.classList.toggle("active",b===btn));document.getElementById("boardEraser").classList.remove("active");document.querySelectorAll(".whiteboard-tools [data-board-color]").forEach(item=>item.classList.remove("active"));document.querySelectorAll(".whiteboard-tools [data-board-width]").forEach(item=>item.classList.remove("active"));}
document.querySelectorAll(".whiteboard-tools [data-board-color]").forEach(button=>button.onclick=()=>{
  setBoardTool("pen");whiteboardColor=button.dataset.boardColor;whiteboardErase=false;
  document.querySelectorAll(".whiteboard-tools [data-board-color]").forEach(item=>item.classList.toggle("active",item===button));
  document.getElementById("boardEraser").classList.remove("active");
});
document.querySelectorAll(".whiteboard-tools [data-board-width]").forEach(button=>button.onclick=()=>{
  setBoardTool("pen");whiteboardWidth=Number(button.dataset.boardWidth);whiteboardErase=false;
  document.querySelectorAll(".whiteboard-tools [data-board-width]").forEach(item=>item.classList.toggle("active",item===button));
  document.getElementById("boardEraser").classList.remove("active");
});
document.getElementById("boardEraser").onclick=event=>{setBoardTool("pen");whiteboardErase=!whiteboardErase;event.currentTarget.classList.toggle("active",whiteboardErase);};
document.getElementById("boardUndo").onclick=()=>{whiteboardStrokes.pop();redrawWhiteboard();};
document.getElementById("boardClear").onclick=()=>{whiteboardStrokes=[];boardItems=[];redrawWhiteboard();renderBoardItems();};
document.getElementById("boardClose").onclick=closeWhiteboard;
document.getElementById("boardEditorLatex").oninput=renderLatexPreview;
document.getElementById("boardEditorSave").onclick=()=>{const it=boardEditor.currentItem;if(!it)return;const en=document.getElementById("boardEditorEn"),tr=document.getElementById("boardEditorTr"),lx=document.getElementById("boardEditorLatex");if(it.type==="text"){it.textEn=en.value;it.textTr=tr.value;}else{it.latex=lx.value;}boardEditor.classList.remove("open");boardEditor.setAttribute("aria-hidden","true");boardEditor.currentItem=null;renderBoardItems();};
document.getElementById("boardEditorCancel").onclick=()=>{boardEditor.classList.remove("open");boardEditor.setAttribute("aria-hidden","true");boardEditor.currentItem=null;};
document.getElementById("boardPrint").onclick=printWhiteboard;
document.getElementById("boardEditorSwap").onclick=()=>{const en=document.getElementById("boardEditorEn"),tr=document.getElementById("boardEditorTr");const tmp=en.value;en.value=tr.value;tr.value=tmp;};
document.addEventListener("keydown",e=>{
  if(boardEditor.classList.contains("open")){if(e.key==="Escape"){document.getElementById("boardEditorCancel").click();}return;}
  if(whiteboardActive){if(e.key==="Escape")closeWhiteboard();return;}
  if(annotationActive){if(e.key==="Escape") closeAnnotation();return;}
  if(e.target.closest&&e.target.closest("input,textarea")) return;
  const i=lessonIdx(cur);
  if(e.key==="ArrowRight"&&i<D.lessons.length-1) go(D.lessons[i+1].n);
  if(e.key==="ArrowLeft"&&i>0) go(D.lessons[i-1].n);
});
const hm=(location.hash||"").replace(/^#(?:(?:uz|ru)&?)?/,"#").match(/^#(\d+)(?:\/(\w+))?/);
if(hm&&lessonIdx(parseInt(hm[1],10))>=0) cur=parseInt(hm[1],10);
applyLang(); buildNav(); tab=tabsFor(D.lessons[lessonIdx(cur)])[0];
if(hm&&hm[2]&&tabsFor(D.lessons[lessonIdx(cur)]).includes(hm[2])) tab=hm[2];
render();
</script>
</body>
</html>;