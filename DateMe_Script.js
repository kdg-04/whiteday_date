(() => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const btnArea = document.getElementById("btnArea");
  const result = document.getElementById("result");

  const title = document.querySelector(".card h1");

  const step2 = document.getElementById("step2");
  const timeSel = document.getElementById("timeSel");
  const placeSel = document.getElementById("placeSel");
  const confirmBtn = document.getElementById("confirmBtn");
  const summary = document.getElementById("summary");

  const timeCustom = document.getElementById("timeCustom");
  const placeCustom = document.getElementById("placeCustom");

  const shareBtn = document.getElementById("shareBtn");
  const shareHint = document.getElementById("shareHint");

  if (
    !yesBtn ||
    !noBtn ||
    !btnArea ||
    !result ||
    !step2 ||
    !timeSel ||
    !placeSel ||
    !confirmBtn ||
    !summary ||
    !timeCustom ||
    !placeCustom ||
    !shareBtn ||
    !shareHint
  )
    return;

  // 배경 미리 로드
  ["Cat1.jpg", "Cat2.jpg"].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Yes 클릭
  yesBtn.addEventListener("click", () => {
    document.body.style.backgroundImage =
      'linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url("Cat2.jpg")';

    result.style.display = "block";

    if (title) {
      title.style.opacity = "0";
      setTimeout(() => {
        title.style.display = "none";
      }, 350);
    }

    btnArea.style.display = "none";
    step2.style.display = "block";

    createSakuraFireworks();
  });

  // 기타 선택 시 입력칸 토글
  timeSel.addEventListener("change", () => {
    if (timeSel.value === "etc") {
      timeCustom.style.display = "block";
      timeCustom.focus();
    } else {
      timeCustom.style.display = "none";
      timeCustom.value = "";
    }
  });

  placeSel.addEventListener("change", () => {
    if (placeSel.value === "etc") {
      placeCustom.style.display = "block";
      placeCustom.focus();
    } else {
      placeCustom.style.display = "none";
      placeCustom.value = "";
    }
  });

  // 확정
  confirmBtn.addEventListener("click", () => {
    let t = timeSel.value;
    let p = placeSel.value;

    if (t === "etc") t = timeCustom.value.trim();
    if (p === "etc") p = placeCustom.value.trim();

    summary.style.display = "block";

    if (!t || !p) {
      summary.textContent = "시간/장소 둘 다 선택(또는 입력)해줘 !!";
      return;
    }

    summary.innerHTML = `✅ 확정!<br><b>시간:</b> ${t}<br><b>장소:</b> ${p}`;

    // 공유 링크 생성
    const url = new URL(location.href);
    url.searchParams.set("t", t);
    url.searchParams.set("p", p);

    history.replaceState(null, "", url.toString());

    shareBtn.style.display = "block";
    shareBtn.dataset.link = url.toString();
    shareHint.style.display = "none";
  });

  // 공유
  shareBtn.addEventListener("click", async () => {
    const link = shareBtn.dataset.link || location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "데이트 확정 💌",
          text: "시간/장소 확정했어!",
          url: link,
        });
        return;
      } catch (e) {}
    }

    try {
      await navigator.clipboard.writeText(link);
      shareHint.textContent = "✅ 링크 복사 완료. 그대로 보내면 됨!";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      shareHint.textContent = "✅ 링크 복사 완료!";
    }

    shareHint.style.display = "block";
  });

  // No 도망
  function moveNo() {
    const w = noBtn.offsetWidth || 120;
    const h = noBtn.offsetHeight || 48;

    const maxX = btnArea.clientWidth - w;
    const maxY = btnArea.clientHeight - h;

    const x = Math.max(0, Math.random() * maxX);
    const y = Math.max(0, Math.random() * maxY);

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
  }

  noBtn.addEventListener("mouseenter", moveNo);

  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      moveNo();
    },
    { passive: false }
  );

  noBtn.addEventListener("pointerenter", moveNo);
  noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    moveNo();
  });

  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    moveNo();
  });

  // 링크로 열었을 때 자동 복원
  function initFromURL() {
    const sp = new URLSearchParams(location.search);
    const t = sp.get("t");
    const p = sp.get("p");
    if (!t || !p) return;

    document.body.style.backgroundImage =
      'linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.35)), url("Cat2.jpg")';

    result.style.display = "block";

    if (title) {
      title.style.opacity = "0";
      setTimeout(() => {
        title.style.display = "none";
      }, 350);
    }

    btnArea.style.display = "none";
    step2.style.display = "block";

    // 기타 입력 복원 처리
    if (
      t !== "3/14(토) 12:00" &&
      t !== "3/14(토) 12:30" &&
      t !== "3/14(토) 13:00" &&
      t !== "3/14(토) 13:30"
    ) {
      timeSel.value = "etc";
      timeCustom.style.display = "block";
      timeCustom.value = t;
    } else {
      timeSel.value = t;
      timeCustom.style.display = "none";
      timeCustom.value = "";
    }

    if (p !== "진주" && p !== "사천" && p !== "창원" && p !== "부산") {
      placeSel.value = "etc";
      placeCustom.style.display = "block";
      placeCustom.value = p;
    } else {
      placeSel.value = p;
      placeCustom.style.display = "none";
      placeCustom.value = "";
    }

    summary.style.display = "block";
    summary.innerHTML = `✅ 확정!<br><b>시간:</b> ${t}<br><b>장소:</b> ${p}`;

    shareBtn.style.display = "block";
    shareBtn.dataset.link = location.href;
  }

  initFromURL();

  // 폭죽
  function createSakuraFireworks() {
    const emojis = ["🌸", "🌸", "🌸", "🍬", "🍭"];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < 10; i++) {
      const rocket = document.createElement("div");
      rocket.className = "heart";
      rocket.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const startX = Math.random() * W;
      const startY = H + 20;

      const burstX = startX + (Math.random() * 120 - 60);
      const burstY = H * (0.35 + Math.random() * 0.25);

      const rocketDur = 700 + Math.random() * 500;
      const rocketScale = 0.8 + Math.random() * 0.9;

      rocket.style.left = startX + "px";
      rocket.style.top = startY + "px";

      document.body.appendChild(rocket);

      rocket
        .animate(
          [
            { transform: `translate(0,0) scale(${rocketScale})`, opacity: 1 },
            {
              transform: `translate(${burstX - startX}px, ${
                burstY - startY
              }px) scale(${rocketScale * 1.05}) rotate(${
                Math.random() * 180
              }deg)`,
              opacity: 1,
            },
          ],
          {
            duration: rocketDur,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "forwards",
          }
        )
        .onfinish = () => {
          rocket.remove();

          for (let j = 0; j < 12; j++) {
            const p = document.createElement("div");
            p.className = "heart";
            p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            p.style.left = burstX + "px";
            p.style.top = burstY + "px";

            const scale = 0.5 + Math.random() * 1.3;

            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 180;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;

            const dur = 1200 + Math.random() * 900;
            const rot = Math.random() * 720 - 360;

            document.body.appendChild(p);

            const anim = p.animate(
              [
                {
                  transform: `translate(0,0) scale(${scale}) rotate(0deg)`,
                  opacity: 1,
                },
                {
                  transform: `translate(${dx}px, ${
                    dy + 40
                  }px) scale(${scale}) rotate(${rot}deg)`,
                  opacity: 0,
                },
              ],
              {
                duration: dur,
                easing: "cubic-bezier(.1,.9,.2,1)",
                fill: "forwards",
              }
            );

            anim.onfinish = () => p.remove();
          }
        };
    }
  }
})();
