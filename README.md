# 2024F Database Final Project - OOTD

> [!TIP]  
> 歡迎來到 OOTD – 全球茶葉的專屬天地。  
> OOTD是一群對於茶具有執著與熱忱的人們所成立的網站，目的在於利用茶帶給各位歡樂。   
> 在 OOTD，我們相信每一杯茶都能帶來不同的故事。  
> 網站精選來自世界各地的高品質茶葉，無論您是茶藝大師還是初學者，都能在這裡找到屬於您的茶香。  
> 我們的茶葉來自中國、印度、台灣等知名產茶區，從綠茶、紅茶到獨特的混合茶，種類繁多，滿足各種口味需求。  
> 無論您身處何地，我們都能將最好的茶葉送到您的身邊。探索 OOTD，品味世界茶文化。

# 啟動方法
這是設計給Docker compose的Branch

請先下載這個repo [HeavenManySugar/OOTD-FullStack](https://github.com/HeavenManySugar/OOTD-FullStack)

可以透過這串命令來完成，以確保所有依賴都有正確下載
```bash
git clone --recursive https://github.com/HeavenManySugar/OOTD-FullStack.git
```
接著進入OOTD-FullStack資料夾，執行以下指令
```bash
docker compose up
```
即可執行資料庫+後端+前端系統

**請注意第一次啟動需要等待至少30秒**

如果有進行前、後端的修改，請重新建構容器
```bash
docker compose up --build --force-recreate --no-deps
```

NOTE: 資料庫檔案會存放在同個資料夾下的db-data之中，執行更新時應該不會破壞資料庫中的資料


# 成員名單

- 111590004 張意昌
- 111590009 陳世昂
- 111590011 吳耀東
- 111590012 林品緯 (舞蹈專家)
- 111590028 張睿恩 (前端大師)

# 特別感謝

- 北科資工109級校友黃漢軒
- 北科資工110級大四學長黃政
