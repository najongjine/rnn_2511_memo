// db.ts (수정 버전)

import * as SQLite from "expo-sqlite";
import { Memo } from "../types/types";

const DATABASE_NAME = "memo_db.db";

// DB 객체를 저장할 변수 (초기에는 undefined)
let database: SQLite.SQLiteDatabase | undefined;

/**
 * DB 연결 객체를 비동기적으로 가져옵니다.
 * 아직 연결되지 않았다면 새로 연결을 시도합니다.
 */
const getDb = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    // openDatabaseAsync가 완료될 때까지 await
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return database;
};

/**
 * 1. DB 초기화: 테이블 생성 및 준비
 * 이제 initDB 내부에서 await getDb()를 사용하여 DB 객체를 가져옵니다.
 */
export const initDB = async (): Promise<boolean> => {
  const db = await getDb(); // DB 객체를 비동기적으로 가져옴

  // Promise 기반의 db.execAsync를 사용하거나,
  // db.runAsync, db.getAllAsync 등을 사용해야 합니다.
  // 기존의 transaction 패턴을 유지하고 싶다면, execAsync를 사용해 트랜잭션 문을 실행합니다.

  const createTableSQL = `
        CREATE TABLE IF NOT EXISTS memos (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            date TEXT
        );
    `;

  try {
    // executeSql 대신 db.execAsync를 사용하여 SQL을 실행합니다.
    // execAsync는 트랜잭션 내에서 여러 SQL 문을 실행할 수 있게 해줍니다.
    await db.execAsync(createTableSQL);
    console.log("Memos table created successfully or already exists.");
    return true;
  } catch (error) {
    console.error("Failed to execute SQL:", error);
    throw error;
  }
};

/**
 * 2. 메모 추가 (Create)
 */
export const addMemo = async (
  title: string,
  content: string
): Promise<number> => {
  const db = await getDb();
  const date = new Date().toISOString();

  try {
    // db.runAsync는 INSERT, UPDATE, DELETE 구문에 적합하며, 삽입된 ID 정보를 반환합니다.
    const result = await db.runAsync(
      `INSERT INTO memos (title, content, date) VALUES (?, ?, ?);`,
      title,
      content,
      date
    );
    // lastInsertRowId는 삽입된 행의 ID입니다.
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding memo:", error);
    throw error;
  }
};

/**
 * 3. 메모 목록 가져오기 (Read All)
 */
export const getMemos = async (): Promise<Memo[]> => {
  const db = await getDb();

  try {
    // db.getAllAsync는 SELECT 구문에 적합하며, 결과 행 전체를 배열로 반환합니다.
    const memos: Memo[] = await db.getAllAsync<Memo>(
      `SELECT * FROM memos ORDER BY date DESC;`,
      []
    );
    return memos;
  } catch (error) {
    console.error("Error fetching memos:", error);
    throw error;
  }
};

/**
 * 4. 메모 단일 항목 가져오기 (Read Single)
 */
export const getMemoById = async (id: number): Promise<Memo | null> => {
  const db = await getDb();
  try {
    // db.getFirstAsync는 SELECT 구문에 적합하며, 첫 번째 결과 행을 반환합니다.
    const memo: Memo | null = await db.getFirstAsync<Memo>(
      `SELECT * FROM memos WHERE id = ?;`,
      [id]
    );
    return memo;
  } catch (error) {
    console.error("Error fetching memo by ID:", error);
    throw error;
  }
};

/**
 * 5. 메모 수정 (Update)
 */
export const updateMemo = async (
  id: number,
  title: string,
  content: string
): Promise<number> => {
  const db = await getDb();

  try {
    let result: SQLite.SQLiteRunResult;
    const now = new Date(); // 현재 시간 객체 생성

    // 옵션 설정: 24시간제(hour12: false), 두 자리 숫자 유지(2-digit)
    const kstTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    if (id) {
      // db.runAsync는 UPDATE 구문에 적합하며, 변경된 행의 수를 반환합니다.
      result = await db.runAsync(
        `UPDATE memos SET 
      title = ?
      , content = ? 
      WHERE id = ?;`,
        title,
        content,
        id
      );
    } else {
      result = await db.runAsync(
        // SQL 쿼리: 새로운 레코드를 삽입 (id는 보통 자동으로 증가)
        `INSERT INTO memos (title, content, date) VALUES (?, ?, ?);`,
        // 바인딩 값: SQL 쿼리의 '?'에 순서대로 매핑될 값
        title,
        content,
        kstTime
      );
    }
    // changes는 영향을 받은(수정된) 행의 수입니다.
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error updating memo:", error);
    throw error;
  }
};

export const deleteMemoById = async (id: number): Promise<boolean> => {
  const db = await getDb();
  try {
    // 실행(INSERT, UPDATE, DELETE)에는 runAsync를 사용합니다.
    const result = await db.runAsync(`DELETE FROM memos WHERE id = ?;`, [id]);

    // result.changes는 삭제된 행의 개수입니다.
    // 0보다 크면 삭제 성공, 0이면 해당 ID가 없어서 삭제 안 됨.
    return result.changes > 0;
  } catch (error) {
    console.error("Error deleting memo:", error);
    throw error;
  }
};
