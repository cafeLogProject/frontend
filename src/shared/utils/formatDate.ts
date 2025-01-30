/**
 * 날짜 문자열을 지정된 형식으로 포맷팅합니다.
 * @param dateStr - ISO 8601 형식의 날짜 문자열 또는 Date 객체가 허용되는 값
 * @param format - 원하는 출력 형식 (예: 'YYYY.MM.DD')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (dateStr: string, format: string = 'YYYY.MM.DD'): string => {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  };
  